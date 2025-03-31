
import { useMemo } from "react";

/**
 * Hook pour traiter les données des contributeurs
 */
export function useContributors(contributors = [], expenses = 0) {
  return useMemo(() => {
    // Calculer les parts des contributeurs
    const contributorShares = contributors.map((contributor, index) => {
      const start = index === 0 ? 0 : contributors.slice(0, index).reduce((sum, c) => sum + c.percentage_contribution, 0);
      const end = start + contributor.percentage_contribution;
      
      return {
        name: contributor.name,
        start,
        end,
        amount: (contributor.percentage_contribution / 100) * expenses
      };
    });
    
    // Calculer les parts des dépenses (simplifié pour l'exemple)
    const expenseTypes = [
      { name: "Logement", percentage: 35 },
      { name: "Alimentation", percentage: 25 },
      { name: "Transport", percentage: 15 },
      { name: "Loisirs", percentage: 10 },
      { name: "Divers", percentage: 15 }
    ];
    
    const expenseShares = expenseTypes.map((type, index) => {
      const start = index === 0 ? 0 : expenseTypes.slice(0, index).reduce((sum, t) => sum + t.percentage, 0);
      const end = start + type.percentage;
      
      return {
        name: type.name,
        start,
        end,
        amount: (type.percentage / 100) * expenses
      };
    });
    
    return {
      contributorShares,
      expenseShares
    };
  }, [contributors, expenses]);
}
