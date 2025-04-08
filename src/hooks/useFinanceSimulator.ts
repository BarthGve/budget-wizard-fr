
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
  initialData: SimulatorData,
  userProfile?: Profile | null,
  onClose?: () => void
) => {
  const [data, setData] = useState<SimulatorData>(initialData);
  const [isUpdating, setIsUpdating] = useState(false);
  const queryClient = useQueryClient();

  // Calculer le total des revenus
  const totalRevenue = data.contributors.reduce(
    (sum, contributor) => sum + contributor.total_contribution,
    0
  );

  // Calculer le montant d'épargne basé sur le pourcentage
  const savingsAmount = (totalRevenue * data.savingsGoalPercentage) / 100;

  // Calculer le montant restant disponible
  const remainingAmount = totalRevenue - data.expenses - data.creditPayments - savingsAmount;

  // Mettre à jour les contributeurs
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

  // Mettre à jour le pourcentage d'épargne
  const updateSavingsGoal = (percentage: number) => {
    setData((prev) => ({
      ...prev,
      savingsGoalPercentage: percentage,
    }));
  };

  // Appliquer les modifications à l'application
  const applyChanges = async () => {
    if (!userProfile?.id) {
      toast.error("Profil utilisateur introuvable");
      return;
    }

    setIsUpdating(true);
    try {
      // 1. Mettre à jour les contributeurs
      for (const contributor of data.contributors) {
        const { error } = await supabase
          .from("contributors")
          .update({ total_contribution: contributor.total_contribution })
          .eq("id", contributor.id)
          .eq("profile_id", userProfile.id);

        if (error) throw error;
      }

      // 2. Mettre à jour l'objectif d'épargne dans le profil
      const { error } = await supabase
        .from("profiles")
        .update({ savings_goal_percentage: data.savingsGoalPercentage })
        .eq("id", userProfile.id);

      if (error) throw error;

      // 3. Invalider les requêtes pour forcer un rafraîchissement
      queryClient.invalidateQueries({ queryKey: ["dashboard-data"] });
      queryClient.invalidateQueries({ queryKey: ["current-profile"] });

      toast.success("Simulation appliquée avec succès");

      // Fermer le dialog
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
