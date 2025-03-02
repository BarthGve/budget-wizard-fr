
import { useEffect } from "react";
import { StepOne } from "./steps/StepOne";
import { StepTwo } from "./steps/StepTwo";
import { StepThree } from "./steps/StepThree";
import { StepFour } from "./steps/StepFour";
import { StepFive } from "./steps/StepFive";
import { WizardStepper } from "./components/WizardStepper";
import { Step } from "./types";
import { SavingsProject } from "@/types/savings-project";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useProjectWizard } from "./hooks/useProjectWizard";
import { createProject, createMonthlySaving } from "./utils/projectUtils";

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
    setError
  } = useProjectWizard({ onClose, onProjectCreated });
  
  const { toast } = useToast();

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

      toast({
        title: "Projet créé avec succès",
        description: formData.added_to_recurring 
          ? "Votre projet et son versement mensuel ont été créés" 
          : "Votre projet a été créé"
      });
      
      onProjectCreated();
      onClose();
    } catch (err) {
      console.error("Erreur lors de la création du projet:", err);
      setError("Impossible de créer le projet");
      toast({
        title: "Erreur",
        description: "Impossible de créer le projet",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;
  const isLastStep = currentStep === steps.length - 1;
  const isSecondStep = currentStep === 1;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <DialogTitle className="text-2xl">Nouveau projet d'épargne</DialogTitle>
          <DialogDescription>
            Créez un nouveau projet d'épargne et suivez sa progression
          </DialogDescription>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <WizardStepper 
        steps={steps.map(step => step.title)} 
        currentStep={currentStep} 
        onStepClick={setCurrentStep}
      />

      <div className="min-h-[300px] flex flex-col">
        <div className="flex-1">
          <CurrentStepComponent 
            data={formData} 
            onChange={handleChange}
            mode={savingsMode}
            onModeChange={handleModeChange}
          />
        </div>

        <div className="flex justify-between mt-8">
          <Button 
            variant="outline" 
            onClick={currentStep === 0 ? onClose : handlePrevious}
          >
            {currentStep === 0 ? 'Annuler' : 'Précédent'}
          </Button>

          <Button 
            onClick={isLastStep ? handleFinish : handleNext}
            disabled={isLoading || (isSecondStep && !formData.montant_total)}
          >
            {isLastStep ? 'Créer le projet' : 'Suivant'}
          </Button>
        </div>
      </div>
    </div>
  );
};
