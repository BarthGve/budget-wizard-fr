
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SavingsMode, SavingsProject } from '@/types/savings-project';
import { Button } from "@/components/ui/button";
import { StepOne } from './steps/StepOne';
import { StepTwo } from './steps/StepTwo';
import { StepThree } from './steps/StepThree';
import { StepFour } from './steps/StepFour';
import { StepFive } from './steps/StepFive';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';

interface SavingsProjectWizardProps {
  onClose: () => void;
  onProjectCreated: () => void;
}

export const SavingsProjectWizard = ({ onClose, onProjectCreated }: SavingsProjectWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [projectData, setProjectData] = useState<Partial<SavingsProject>>({
    id: uuidv4(),
    name: '',
    description: '',
    image_url: '/placeholder.svg',
    target_amount: 0,
    convert_to_monthly: false
  });
  const [savingsMode, setSavingsMode] = useState<SavingsMode>("par_date");
  const { toast } = useToast();
  const navigate = useNavigate();

  const steps = [
    { title: "Informations", component: StepOne },
    { title: "Objectif", component: StepTwo },
    { title: "Mode d'épargne", component: StepThree },
    { title: "Planification", component: StepFour },
    { title: "Configuration", component: StepFive }
  ];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const supabaseProject = {
        id: projectData.id,
        profile_id: user.id,
        mode_planification: savingsMode,
        montant_total: projectData.target_amount || 0,
        nom_projet: projectData.name || '',
        description: projectData.description,
        montant_mensuel: projectData.monthly_amount,
        date_estimee: projectData.target_date,
        added_to_recurring: projectData.convert_to_monthly,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        image_url: projectData.image_url
      };

      const { error: projectError } = await supabase
        .from('projets_epargne')
        .insert(supabaseProject);

      if (projectError) throw projectError;

      if (projectData.convert_to_monthly && projectData.monthly_amount) {
        const { error: savingError } = await supabase
          .from('monthly_savings')
          .insert({
            profile_id: user.id,
            name: projectData.name,
            amount: projectData.monthly_amount,
            description: projectData.description,
            logo_url: projectData.image_url
          });

        if (savingError) throw savingError;
      }

      toast({
        title: "Projet créé avec succès",
        description: "Votre projet d'épargne a été enregistré"
      });

      onProjectCreated();
      onClose();
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le projet",
        variant: "destructive"
      });
    }
  };

  const renderStepper = () => (
    <div className="mb-8">
      <div className="flex justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div 
              className={`rounded-full h-8 w-8 flex items-center justify-center border-2 
                ${currentStep > index + 1 ? 'bg-primary text-white border-primary' : 
                  currentStep === index + 1 ? 'border-primary text-primary' : 
                  'border-gray-300 text-gray-300'}`}
            >
              {index + 1}
            </div>
            {index < steps.length - 1 && (
              <div 
                className={`h-[2px] w-24 mx-2 ${
                  currentStep > index + 1 ? 'bg-primary' : 'bg-gray-300'
                }`}
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-2">
        {steps.map((step, index) => (
          <div key={index} className="text-sm text-center" style={{ width: '100px' }}>
            {step.title}
          </div>
        ))}
      </div>
    </div>
  );

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
        {renderStepper()}
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
