
import { useMemo } from "react";
import { Contributor } from "@/types/contributor";

interface ContributorMapperProps {
  contributors: Contributor[];
}

/**
 * Composant qui transforme les contributeurs pour les adapter au format attendu
 */
export const useContributorMapper = ({ contributors = [] }: ContributorMapperProps) => {
  // Memoize mapped contributors to avoid unnecessary recalculations
  return useMemo(() => {
    return contributors.map(contributor => ({
      ...contributor,
      is_owner: contributor.is_owner ?? false, 
      percentage_contribution: contributor.percentage_contribution ?? 0,
      expenseShare: 0,
      creditShare: 0
    }));
  }, [contributors]);
};
