
import { useEffect } from "react";
import { StepOne } from "./steps/StepOne";
import { StepTwo } from "./steps/StepTwo";
import { StepThree } from "./steps/StepThree";
import { StepFour } from "./steps/StepFour";
import { StepFive } from "./steps/StepFive";
import { WizardStepper } from "./components/WizardStepper";
import { Step } from "./types";
import { Button } from "@/components/ui/button";
import { DialogTitle, DialogDescription, Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useProjectWizard } from "./hooks/useProjectWizard";
import { createProject, createMonthlySaving } from "./utils/projectUtils";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SavingsProjectWizardProps {
  onClose: () => void;
  onProjectCreated: () => void;
}

export const SavingsProjectWizard = ({ onClose, onProjectCreated }: SavingsProjectWizardProps) => {
  const {
    currentStep,
    formData,
    savingsMode,
    isLoading,
    error,
    setCurrentStep,
    handleNext,
    handlePrevious,
    handleChange,
    handleModeChange,
    setFormData,
    setIsLoading,
    setError,
  } = useProjectWizard({ onClose, onProjectCreated });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const steps: Step[] = [
    {
      title: "Informations générales",
      component: StepOne,
    },
    {
      title: "Objectif financier",
      component: StepTwo,
    },
    {
      title: "Image du projet",
      component: StepThree,
    },
    {
      title: "Planification",
      component: StepFour,
    },
    {
      title: "Versement mensuel",
      component: StepFive,
    },
  ];

  const handleFinish = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const newProject = await createProject(formData, savingsMode);
      
      if (formData.added_to_recurring && newProject) {
        await createMonthlySaving(formData, newProject.profile_id, newProject.id);
      }

      // Invalider manuellement les queries après création réussie
      await queryClient.invalidateQueries({ queryKey: ["savings-projects"] });

      // Forcer un rafraîchissement immédiat
      setTimeout(() => {
        queryClient.refetchQueries({ queryKey: ["savings-projects"] });
        queryClient.refetchQueries({ queryKey: ["dashboard-data"] });
      }, 100);

      toast({
        title: "Projet créé avec succès",
        description: formData.added_to_recurring 
          ? "Votre projet et son versement mensuel ont été créés." 
          : "Votre projet a été créé.",
      });
      
      onProjectCreated();
      onClose();
    } catch (err) {
      console.error("Erreur lors de la création du projet:", err);
      setError("Impossible de créer le projet");
      toast({
        title: "Erreur",
        description: "Impossible de créer le projet.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;
  const isLastStep = currentStep === steps.length - 1;
  const isSecondStep = currentStep === 1;

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="p-0 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className={cn(
            "space-y-6 bg-gradient-to-t from-green-50 via-white to-green-100",
            "dark:bg-gradient-to-t dark:from-green-900 dark:via-gray-800 dark:to-green-950",
            "shadow-xl rounded-lg w-full p-6"
          )}
        >
          {/* En-tête avec titre et bouton de fermeture */}
          <div className="flex justify-between items-center">
            <div>
              <DialogTitle className="text-2xl font-bold text-green-800 dark:text-green-300">
                Nouveau projet d'épargne
              </DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-gray-400">
                Créez un nouveau projet d'épargne et suivez sa progression.
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              onClick={onClose}
              className="text-green-600 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/30 p-2"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Étapes du wizard */}
          <WizardStepper 
            steps={steps.map((step) => step.title)}
            currentStep={currentStep}
            onStepClick={setCurrentStep}
            className="pt-4"
          />

          {/* Contenu principal */}
          <div className="min-h-[300px] flex flex-col">
            <div className="flex-1">
              <CurrentStepComponent 
                data={formData}
                onChange={handleChange}
                mode={savingsMode}
                onModeChange={handleModeChange}
              />
            </div>

            {/* Boutons de navigation */}
            <div className="flex justify-between mt-8">
              <Button 
                variant="outline"
                onClick={currentStep === 0 ? onClose : handlePrevious}
                className="border-green-300 text-green-700 dark:text-green-300 dark:border-green-600"
              >
                {currentStep === 0 ? "Annuler" : "Précédent"}
              </Button>

              <Button
                onClick={isLastStep ? handleFinish : handleNext}
                disabled={isLoading || (isSecondStep && !formData.montant_total)}
                className={cn(
                  "bg-green-600 text-white hover:bg-green-500 dark:bg-green-700",
                  "dark:hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                {isLastStep ? "Créer le projet" : "Suivant"}
              </Button>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};
