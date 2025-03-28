
import { useState, useEffect, useCallback } from 'react';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription 
} from '@/components/ui/sheet';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { StepOne } from './steps/StepOne';
import { StepTwo } from './steps/StepTwo';
import { StepThree } from './steps/StepThree';
import { StepFour } from './steps/StepFour';
import { StepFive } from './steps/StepFive';
import { SavingsProject } from '@/types/savings-project';
import { WizardStepper } from './components/WizardStepper';
import { useProjectWizard } from './hooks/useProjectWizard';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { PiggyBank, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SavingsProjectWizardProps {
  onClose: () => void;
  onProjectCreated: () => void;
}

export const SavingsProjectWizard = ({ onClose, onProjectCreated }: SavingsProjectWizardProps) => {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(true);
  
  const {
    currentStep,
    formData,
    savingsMode,
    isLoading,
    setCurrentStep,
    handleNext,
    handlePrevious,
    handleChange,
    handleModeChange,
    setIsLoading,
    setError
  } = useProjectWizard({ onClose, onProjectCreated });

  // Liste des étapes du wizard
  const steps = [
    "Nom du projet",
    "Montant",
    "Mode",
    "Planification",
    "Confirmation"
  ];

  // Fonction pour fermer le wizard
  const handleClose = useCallback(() => {
    setOpen(false);
    setTimeout(() => {
      onClose();
    }, 300); // Attendre la fin de l'animation
  }, [onClose]);

  // Gérer la soumission du projet
  const handleSubmit = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Récupérer l'utilisateur connecté
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Utilisateur non connecté");
        return;
      }

      // Préparer les données du projet
      const projectData = {
        profile_id: user.id,
        nom_projet: formData.nom_projet,
        description: formData.description || "",
        montant_total: formData.montant_total,
        target_date: formData.target_date || null,
        montant_mensuel: formData.montant_mensuel || null,
        mode_planification: savingsMode,
        nombre_mois: formData.nombre_mois || null,
        date_estimee: formData.date_estimee || null,
        added_to_recurring: false,
        statut: "actif" as "actif" | "dépassé" | "en_attente", // Correction du type
        image_url: formData.image_url || null
      };

      // Insérer le projet dans la base de données
      const { error } = await supabase
        .from('projets_epargne')
        .insert(projectData);

      if (error) throw error;

      toast.success("Projet d'épargne créé avec succès !");
      onProjectCreated();
      handleClose();
    } catch (error: any) {
      console.error("Erreur lors de la création du projet:", error);
      setError(error.message || "Erreur lors de la création du projet");
      toast.error(error.message || "Erreur lors de la création du projet");
    } finally {
      setIsLoading(false);
    }
  }, [formData, savingsMode, setIsLoading, setError, onProjectCreated, handleClose]);

  // Style commun pour le contenu
  const renderContent = () => (
    <div className="space-y-6 py-2 max-w-full">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
          <PiggyBank className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-purple-900 dark:text-purple-100">
            Nouveau projet d'épargne
          </h2>
          <p className="text-sm text-purple-700/80 dark:text-purple-300/80">
            Planifiez votre objectif d'épargne en quelques étapes simples
          </p>
        </div>
      </div>

      <WizardStepper 
        steps={steps}
        currentStep={currentStep}
        colorScheme="purple"
        className={isMobile ? "scale-90 -ml-5 -mr-5 w-[calc(100%+40px)]" : ""}
      />

      <div className="min-h-[300px] py-4">
        {currentStep === 0 && (
          <StepOne 
            data={formData} 
            onChange={handleChange} 
          />
        )}
        {currentStep === 1 && (
          <StepTwo 
            data={formData} 
            onChange={handleChange} 
          />
        )}
        {currentStep === 2 && (
          <StepThree 
            data={formData} 
            onChange={handleChange} 
            savingsMode={savingsMode}
            onModeChange={handleModeChange}
          />
        )}
        {currentStep === 3 && (
          <StepFour 
            data={formData} 
            onChange={handleChange} 
            savingsMode={savingsMode} 
          />
        )}
        {currentStep === 4 && (
          <StepFive 
            data={formData} 
            savingsMode={savingsMode} 
          />
        )}
      </div>

      <div className="flex justify-between mt-6 pt-4 border-t">
        <Button
          variant="outline"
          onClick={currentStep === 0 ? handleClose : handlePrevious}
          className="border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-800 dark:text-purple-300 dark:hover:bg-purple-900/20"
        >
          {currentStep === 0 ? "Annuler" : "Précédent"}
        </Button>
        <Button
          onClick={currentStep === steps.length - 1 ? handleSubmit : handleNext}
          disabled={isLoading}
          className="bg-purple-600 hover:bg-purple-500 text-white dark:bg-purple-700 dark:hover:bg-purple-600"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Traitement...
            </>
          ) : currentStep === steps.length - 1 ? (
            "Créer le projet"
          ) : (
            "Suivant"
          )}
        </Button>
      </div>
    </div>
  );

  // Utiliser le Sheet pour mobile et Dialog pour desktop avec style cohérent
  return isMobile ? (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent 
        side="bottom" 
        className="h-[90vh] rounded-t-xl pt-6 px-4 pb-8 overflow-y-auto bg-gradient-to-br from-white via-purple-50/40 to-purple-100/70 dark:from-gray-900 dark:via-purple-950/20 dark:to-purple-900/30"
      >
        {renderContent()}
      </SheetContent>
    </Sheet>
  ) : (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-y-auto max-h-[90vh] bg-gradient-to-br from-white via-purple-50/40 to-purple-100/70 dark:from-gray-900 dark:via-purple-950/20 dark:to-purple-900/30">
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
};
