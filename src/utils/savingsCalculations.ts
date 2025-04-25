
// Fonction pour calculer le statut d'épargne et retourner les styles appropriés
export const getSavingsStatus = (totalMonthlySavings: number, savingsGoal: number) => {
  if (savingsGoal <= 0) return null;
  
  const percentage = (totalMonthlySavings / savingsGoal) * 100;
  
  if (percentage >= 100) {
    const overage = totalMonthlySavings - savingsGoal;
    return {
      color: "text-green-600 dark:text-green-400",
      icon: "check",
      message: overage > 0 
        ? `Objectif dépassé de ${overage.toLocaleString('fr-FR')}€`
        : "Objectif atteint"
    };
  }
  
  if (percentage >= 80) {
    return {
      color: "text-amber-600 dark:text-amber-400",
      icon: "alert-circle",
      message: `${percentage.toFixed(1)}% de l'objectif atteint`
    };
  }
  
  return {
    color: "text-red-600 dark:text-red-400",
    icon: "x",
    message: `${percentage.toFixed(1)}% de l'objectif atteint`
  };
};
