

import { Contributor } from "@/types/contributor";

export const calculateContributorsPercentages = (
  contributors: Contributor[],
  updatedContributor: Contributor,
  totalBudget: number
): Contributor[] => {
  return contributors.map((c) => ({
    ...c,
    percentage_contribution:
      ((c.id === updatedContributor.id
        ? updatedContributor.total_contribution
        : c.total_contribution) /
        totalBudget) *
      100,
  }));
};

