
import { useState } from 'react';
import { SavingsMode, SavingsProject } from '@/types/savings-project';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

interface UseSavingsWizardProps {
  onClose: () => void;
  onProjectCreated: () => void;
}

export const useSavingsWizard = ({ onClose, onProjectCreated }: UseSavingsWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [projectData, setProjectData] = useState<Partial<SavingsProject>>({
    id: uuidv4(),
    nom_projet: '',
    description: '',
    image_url: '/placeholder.svg',
    montant_total: 0,
    added_to_recurring: false
  });
  const [savingsMode, setSavingsMode] = useState<SavingsMode>("par_date");
  const { toast } = useToast();

  const validateStep = (step: number): boolean => {
    if (step === 1 && !projectData.nom_projet) {
      toast({
        title: "Champ requis",
        description: "Le nom du projet est obligatoire",
        variant: "destructive"
      });
      return false;
    }

    if (step === 2 && (!projectData.montant_total || projectData.montant_total <= 0)) {
      toast({
        title: "Champ requis",
        description: "L'objectif financier est obligatoire et doit être supérieur à 0",
        variant: "destructive"
      });
      return false;
    }

    if (step === 4) {
      if (savingsMode === 'par_date' && !projectData.date_estimee) {
        toast({
          title: "Champ requis",
          description: "La date cible est obligatoire",
          variant: "destructive"
        });
        return false;
      }
      if (savingsMode === 'par_mensualite' && (!projectData.montant_mensuel || projectData.montant_mensuel <= 0)) {
        toast({
          title: "Champ requis",
          description: "Le montant mensuel est obligatoire et doit être supérieur à 0",
          variant: "destructive"
        });
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) return;
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

      if (!projectData.nom_projet) {
        toast({
          title: "Erreur",
          description: "Le nom du projet est obligatoire",
          variant: "destructive"
        });
        return;
      }

      const supabaseProject = {
        id: projectData.id,
        profile_id: user.id,
        nom_projet: projectData.nom_projet,
        mode_planification: savingsMode,
        montant_total: projectData.montant_total || 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        description: projectData.description || '',
        image_url: projectData.image_url,
        montant_mensuel: projectData.montant_mensuel,
        date_estimee: projectData.date_estimee,
        nombre_mois: projectData.nombre_mois,
        added_to_recurring: projectData.added_to_recurring || false,
        statut: projectData.added_to_recurring ? 'actif' : 'en_attente'
      } as const;

      const { error: projectError } = await supabase
        .from('projets_epargne')
        .insert(supabaseProject);

      if (projectError) throw projectError;

      if (projectData.added_to_recurring && projectData.montant_mensuel) {
        const { error: savingError } = await supabase
          .from('monthly_savings')
          .insert({
            profile_id: user.id,
            name: projectData.nom_projet,
            amount: projectData.montant_mensuel,
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

  return {
    currentStep,
    projectData,
    savingsMode,
    handleNext,
    handlePrevious,
    handleSubmit,
    setProjectData,
    setSavingsMode
  };
};
