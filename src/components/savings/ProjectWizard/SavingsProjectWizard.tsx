
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

export const SavingsProjectWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [projectData, setProjectData] = useState<Partial<SavingsProject>>({
    id: uuidv4(),
    name: '',
    description: '',
    image_url: '/placeholder.svg',
    target_amount: 0,
    convert_to_monthly: false
  });
  const [savingsMode, setSavingsMode] = useState<SavingsMode>('target_date');
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentStep < 5) {
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

      const finalProject: SavingsProject = {
        ...projectData as SavingsProject,
        profile_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { error: projectError } = await supabase
        .from('projets_epargne')
        .insert(finalProject);

      if (projectError) throw projectError;

      // Si l'utilisateur a choisi de convertir en versement mensuel
      if (finalProject.convert_to_monthly && finalProject.monthly_amount) {
        const { error: savingError } = await supabase
          .from('monthly_savings')
          .insert({
            profile_id: user.id,
            name: finalProject.name,
            amount: finalProject.monthly_amount,
            description: finalProject.description,
            logo_url: finalProject.image_url
          });

        if (savingError) throw savingError;
      }

      toast({
        title: "Projet créé avec succès",
        description: "Votre projet d'épargne a été enregistré"
      });

      navigate('/savings');
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le projet",
        variant: "destructive"
      });
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepOne
          data={projectData}
          onChange={setProjectData}
        />;
      case 2:
        return <StepTwo
          data={projectData}
          onChange={setProjectData}
        />;
      case 3:
        return <StepThree
          mode={savingsMode}
          onModeChange={setSavingsMode}
        />;
      case 4:
        return <StepFour
          data={projectData}
          mode={savingsMode}
          onChange={setProjectData}
        />;
      case 5:
        return <StepFive
          data={projectData}
          onChange={setProjectData}
        />;
      default:
        return null;
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Nouveau projet d'épargne</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {renderStep()}
        
        <div className="flex justify-between mt-6">
          {currentStep > 1 && (
            <Button onClick={handlePrevious} variant="outline">
              Précédent
            </Button>
          )}
          {currentStep < 5 ? (
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
