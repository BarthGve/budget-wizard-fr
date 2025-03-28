
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
        statut: "actif",
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

  // Couleurs dans le style du NewSavingDialogContent (vert)
  const colors = {
    iconBg: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    headingText: "text-green-900 dark:text-green-200",
    descriptionText: "text-green-700/80 dark:text-green-300/80",
    buttonBg: "bg-green-600 hover:bg-green-500 text-white dark:bg-green-700 dark:hover:bg-green-600",
    borderLight: "border-green-100/70",
    borderDark: "dark:border-green-800/20",
    lightBg: "from-white via-green-50/40 to-green-100/70",
    darkBg: "dark:from-gray-900 dark:via-green-950/20 dark:to-green-900/30",
  };

  // Rendu conditionnel selon le type d'appareil
  const renderContent = () => (
    <div className={cn(
      "space-y-6 py-2 max-w-full",
      "relative flex flex-col pb-6 rounded-lg",
      "bg-gradient-to-br",
      colors.lightBg,
      colors.darkBg
    )}>
      {/* Fond de décoration */}
      <div className="absolute inset-0 pointer-events-none opacity-5 bg-gradient-to-br rounded-lg from-green-500 to-emerald-400 dark:from-green-600 dark:to-emerald-500" />

      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-200 via-gray-100 to-transparent opacity-[0.015] dark:from-gray-500 dark:via-gray-600 dark:to-transparent dark:opacity-[0.01] rounded-lg" />

      <div className="flex items-center gap-3 mb-2 relative z-10">
        <div className={cn("p-2 rounded-lg", colors.iconBg)}>
          <PiggyBank className="h-5 w-5" />
        </div>
        <div>
          <h2 className={cn("text-xl font-semibold", colors.headingText)}>
            Nouveau projet d'épargne
          </h2>
          <p className={cn("text-sm", colors.descriptionText)}>
            Planifiez votre objectif d'épargne en quelques étapes simples
          </p>
        </div>
      </div>

      <WizardStepper 
        steps={steps}
        currentStep={currentStep}
        colorScheme="green"
        className={isMobile ? "scale-90 -ml-5 -mr-5 w-[calc(100%+40px)]" : ""}
      />

      <div className="min-h-[300px] py-4 relative z-10">
        {currentStep === 0 && <StepOne data={formData} onChange={handleChange} />}
        {currentStep === 1 && <StepTwo data={formData} onChange={handleChange} />}
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

      <div className="flex justify-between mt-6 pt-4 border-t relative z-10">
        <Button
          variant="outline"
          onClick={currentStep === 0 ? handleClose : handlePrevious}
          className="border-green-200 text-green-700 hover:bg-green-50 dark:border-green-800 dark:text-green-300 dark:hover:bg-green-900/20"
        >
          {currentStep === 0 ? "Annuler" : "Précédent"}
        </Button>
        <Button
          onClick={currentStep === steps.length - 1 ? handleSubmit : handleNext}
          disabled={isLoading}
          className={colors.buttonBg}
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
      
      {/* Icône décorative */}
      <div className="absolute bottom-0 right-0 w-32 h-32 pointer-events-none opacity-[0.03] dark:opacity-[0.02]">
        <PiggyBank className="w-full h-full" />
      </div>
    </div>
  );

  // Utiliser le Sheet pour mobile et Dialog pour desktop
  return isMobile ? (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent 
        side="bottom" 
        className={cn(
          "h-[90vh] rounded-t-xl pt-6 px-4 pb-8 overflow-y-auto",
          "p-0 shadow-lg border",
          colors.borderLight, 
          colors.borderDark
        )}
      >
        {renderContent()}
      </SheetContent>
    </Sheet>
  ) : (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className={cn(
        "sm:max-w-[600px] p-0 overflow-y-auto max-h-[90vh]",
        "shadow-lg border rounded-lg",
        colors.borderLight, 
        colors.borderDark
      )}>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
};
