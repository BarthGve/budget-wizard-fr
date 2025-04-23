import { useState } from "react";
import { Profile } from "@/types/profile";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export type ContributorInput = {
  id: string;
  name: string;
  total_contribution: number;
  is_owner: boolean;
};

export type SimulatorData = {
  contributors: ContributorInput[];
  savingsGoalPercentage: number;
  expenses: number;
  creditPayments: number;
};

export const useFinanceSimulator = (
  initialData: SimulatorData & { savingsAmount?: number },
  userProfile?: Profile | null,
  onClose?: () => void,
  actualMonthlySavings?: number
) => {
  const [data, setData] = useState<SimulatorData>(() => {
    if (actualMonthlySavings !== undefined) {
      const totalRev = initialData.contributors.reduce(
        (sum, contributor) => sum + contributor.total_contribution,
        0
      );
      const computedPercentage = totalRev > 0 ? Math.round((actualMonthlySavings / totalRev) * 100) : 0;
      return {
        ...initialData,
        savingsGoalPercentage: computedPercentage,
      };
    }
    return initialData;
  });

  const [isUpdating, setIsUpdating] = useState(false);
  const queryClient = useQueryClient();

  const totalRevenue = data.contributors.reduce(
    (sum, contributor) => sum + contributor.total_contribution,
    0
  );

  const savingsAmount = (actualMonthlySavings !== undefined)
    ? actualMonthlySavings
    : (totalRevenue * data.savingsGoalPercentage) / 100;

  const remainingAmount = totalRevenue - data.expenses - data.creditPayments - savingsAmount;

  const updateContributor = (id: string, amount: number) => {
    setData((prev) => ({
      ...prev,
      contributors: prev.contributors.map((contributor) =>
        contributor.id === id
          ? { ...contributor, total_contribution: amount }
          : contributor
      ),
    }));
  };

  const updateSavingsGoal = (percentage: number) => {
    setData((prev) => ({
      ...prev,
      savingsGoalPercentage: percentage,
    }));
  };

  const applyChanges = async () => {
    if (!userProfile?.id) {
      toast.error("Profil utilisateur introuvable");
      return;
    }

    setIsUpdating(true);
    try {
      for (const contributor of data.contributors) {
        const { error } = await supabase
          .from("contributors")
          .update({ total_contribution: contributor.total_contribution })
          .eq("id", contributor.id)
          .eq("profile_id", userProfile.id);

        if (error) throw error;
      }

      const { error } = await supabase
        .from("profiles")
        .update({ savings_goal_percentage: data.savingsGoalPercentage })
        .eq("id", userProfile.id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["dashboard-data"] });
      queryClient.invalidateQueries({ queryKey: ["current-profile"] });

      toast.success("Simulation appliquée avec succès");

      if (onClose) onClose();
    } catch (error: any) {
      console.error("Erreur lors de l'application des modifications:", error);
      toast.error(`Erreur: ${error.message || "Une erreur est survenue"}`);
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    data,
    totalRevenue,
    savingsAmount,
    remainingAmount,
    updateContributor,
    updateSavingsGoal,
    applyChanges,
    isUpdating,
  };
};
