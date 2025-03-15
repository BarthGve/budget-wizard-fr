
import { useState, useCallback, useEffect } from 'react';
import { SavingsMode, FormData } from '../types';
import { useToast } from '@/hooks/use-toast';

interface UseProjectWizardProps {
  onClose: () => void;
  onProjectCreated: () => void;
}

export const useProjectWizard = ({ onClose }: UseProjectWizardProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({});
  const [savingsMode, setSavingsMode] = useState<SavingsMode>("par_date");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleNext = useCallback(() => {
    setCurrentStep((prev) => prev + 1);
  }, []);

  const handlePrevious = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  // Méthode adaptée pour correspondre à l'interface StepComponentProps
  const handleChange = useCallback((field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleModeChange = useCallback((mode: SavingsMode) => {
    setSavingsMode(mode);
  }, []);

  // Reset form when component unmounts
  useEffect(() => {
    return () => {
      setFormData({});
      setCurrentStep(0);
      setError(null);
    };
  }, []);

  // Show toast when there's an error
  useEffect(() => {
    if (error) {
      toast({
        title: "Erreur",
        description: error,
        variant: "destructive"
      });
    }
  }, [error, toast]);

  return {
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
  };
};
