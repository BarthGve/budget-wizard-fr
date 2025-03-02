
import { useState, useCallback, useEffect } from "react";
import { StepOne } from "./steps/StepOne";
import { StepTwo } from "./steps/StepTwo";
import { StepThree } from "./steps/StepThree";
import { StepFour } from "./steps/StepFour";
import { StepFive } from "./steps/StepFive";
import { WizardStepper } from "./components/WizardStepper";
import { Step, StepComponentProps } from "./types";
import { SavingsMode, SavingsProject } from "@/types/savings-project";
import { useSavingsWizard } from "./hooks/useSavingsWizard";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SavingsProjectWizardProps {
  onClose: () => void;
  onProjectCreated: () => void;
}

export const SavingsProjectWizard = ({ onClose, onProjectCreated }: SavingsProjectWizardProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<SavingsProject>>({});
  const [savingsMode, setSavingsMode] = useState<SavingsMode>("par_date");
  const { toast } = useToast();
  const { isLoading, createProject, error } = useSavingsWizard();

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

  const handleNext = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  }, [steps.length]);

  const handlePrevious = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const handleChange = useCallback((data: Partial<SavingsProject>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  }, []);

  const handleModeChange = useCallback((mode: SavingsMode) => {
    setSavingsMode(mode);
  }, []);

  const handleFinish = async () => {
    try {
      // Créer le projet
      const newProject = await createProject(formData);
      
      // Si l'option "Créer un versement mensuel" est cochée, créer le versement mensuel
      if (formData.added_to_recurring && newProject) {
        const { error } = await supabase.from("monthly_savings").insert({
          name: formData.nom_projet,
          amount: formData.montant_mensuel || 0,
          description: formData.description,
          profile_id: newProject.profile_id,
          projet_id: newProject.id, // Utiliser la nouvelle relation directe
          is_project_saving: true, // Marquer explicitement comme un versement de projet
          logo_url: formData.image_url || '/placeholder.svg'
        });

        if (error) throw error;
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
      toast({
        title: "Erreur",
        description: "Impossible de créer le projet",
        variant: "destructive"
      });
    }
  };

  // Reset form when closing
  useEffect(() => {
    return () => {
      setFormData({});
      setCurrentStep(0);
    };
  }, []);

  // Display error if any
  useEffect(() => {
    if (error) {
      toast({
        title: "Erreur",
        description: error,
        variant: "destructive"
      });
    }
  }, [error, toast]);

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
        onStepClick={(step) => setCurrentStep(step)}
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
