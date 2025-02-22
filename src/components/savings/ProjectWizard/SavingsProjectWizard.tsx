
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StepOne } from './steps/StepOne';
import { StepTwo } from './steps/StepTwo';
import { StepThree } from './steps/StepThree';
import { StepFour } from './steps/StepFour';
import { StepFive } from './steps/StepFive';
import { WizardStepper } from './components/WizardStepper';
import { useSavingsWizard } from './hooks/useSavingsWizard';
import { Step } from './types';

interface SavingsProjectWizardProps {
  onClose: () => void;
  onProjectCreated: () => void;
}

export const SavingsProjectWizard = ({ onClose, onProjectCreated }: SavingsProjectWizardProps) => {
  const {
    currentStep,
    projectData,
    savingsMode,
    handleNext,
    handlePrevious,
    handleSubmit,
    setProjectData,
    setSavingsMode
  } = useSavingsWizard({ onClose, onProjectCreated });

  const steps: Step[] = [
    { title: "Informations", component: StepOne },
    { title: "Objectif", component: StepTwo },
    { title: "Mode d'épargne", component: StepThree },
    { title: "Planification", component: StepFour },
    { title: "Configuration", component: StepFive }
  ];

  const renderStep = () => {
    const StepComponent = steps[currentStep - 1].component;
    return (
      <StepComponent
        data={projectData}
        onChange={setProjectData}
        mode={savingsMode}
        onModeChange={setSavingsMode}
      />
    );
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Nouveau projet d'épargne</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <WizardStepper steps={steps} currentStep={currentStep} />
        {renderStep()}
        
        <div className="flex justify-between mt-6">
          {currentStep > 1 && (
            <Button onClick={handlePrevious} variant="outline">
              Précédent
            </Button>
          )}
          {currentStep < steps.length ? (
            <Button onClick={handleNext} className="ml-auto">
              Suivant
            </Button>
          ) : (
            <Button onClick={handleSubmit} className="ml-auto">
              Créer le projet
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
