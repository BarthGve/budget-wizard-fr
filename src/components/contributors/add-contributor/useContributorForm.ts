
import { useState } from "react";
import { NewContributor } from "@/types/contributor";
import { useQueryClient } from '@tanstack/react-query';
import { useTheme } from "next-themes";

export const useContributorForm = (onAdd: (contributor: NewContributor) => Promise<void>) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [newContributor, setNewContributor] = useState<NewContributor>({
    name: "",
    email: "",
    total_contribution: "",
  });
  const queryClient = useQueryClient();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const resetForm = () => {
    setNewContributor({ name: "", email: "", total_contribution: "" });
  };

  const handleAdd = async () => {
    if (!newContributor.name || !newContributor.total_contribution) {
      return;
    }
    
    setIsSubmitting(true);
    setProgress(0);
    
    // Animation de progression
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const nextProgress = prev + Math.random() * 10;
        return nextProgress > 95 ? 95 : nextProgress;
      });
    }, 200);
    
    try {
      await onAdd(newContributor);
      clearInterval(progressInterval);
      setProgress(100);
      
      setTimeout(() => {
        resetForm();
        setOpen(false);
        setProgress(0);
        
        queryClient.invalidateQueries({ 
          queryKey: ["dashboard-data"],
          exact: false,
          refetchType: 'all'
        });
        queryClient.invalidateQueries({ 
          queryKey: ["contributors"],
          exact: false,
          refetchType: 'all'
        });
      }, 300);
    } catch (error) {
      clearInterval(progressInterval);
      setProgress(0);
      setIsSubmitting(false);
    }
  };
  
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAdd();
  };

  return {
    open,
    setOpen,
    isSubmitting,
    progress,
    newContributor,
    setNewContributor,
    handleFormSubmit,
    resetForm,
    isDarkMode,
  };
};
