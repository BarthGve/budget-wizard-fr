
import { differenceInDays } from "date-fns";
import { SavingsProject } from "@/types/savings-project";

export const useProjectCardCalculations = (project: SavingsProject) => {
  // Calcule le montant économisé
  const calculateSavedAmount = () => {
    // Si le projet est en attente, retourner 0
    if (project.statut === 'en_attente') return 0;
    
    if (!project.montant_mensuel || !project.created_at) return 0;
    
    const daysSinceCreation = differenceInDays(new Date(), new Date(project.created_at));
    const monthsSinceCreation = Math.floor(daysSinceCreation / 30);
    return project.montant_mensuel * monthsSinceCreation;
  };

  // Calcule le pourcentage de progression
  const calculateProgress = () => {
    const savedAmount = calculateSavedAmount();
    return Math.min((savedAmount / project.montant_total) * 100, 100);
  };

  const savedAmount = calculateSavedAmount();
  const progressPercentage = calculateProgress();
  const remainingAmount = project.montant_total - savedAmount;
  const isComplete = progressPercentage >= 100;

  return {
    savedAmount,
    progressPercentage,
    remainingAmount,
    isComplete
  };
};
