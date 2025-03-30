
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Profile, DashboardPreferences } from "@/types/profile";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Valeurs par défaut pour les préférences de tableau de bord
const defaultPreferences: DashboardPreferences = {
  show_revenue_card: true,
  show_expenses_card: true,
  show_credits_card: true,
  show_savings_card: true,
  show_expense_stats: true,
  show_charts: true,
  show_contributors: true
};

export const useDashboardPreferences = (profile: Profile | null | undefined) => {
  // Initialiser les états avec les valeurs du profil ou les valeurs par défaut
  // En utilisant !== false pour garantir que les valeurs sont true par défaut si null/undefined
  const [showRevenueCard, setShowRevenueCard] = useState<boolean>(
    profile?.dashboard_preferences?.show_revenue_card !== false
  );
  const [showExpensesCard, setShowExpensesCard] = useState<boolean>(
    profile?.dashboard_preferences?.show_expenses_card !== false
  );
  const [showCreditsCard, setShowCreditsCard] = useState<boolean>(
    profile?.dashboard_preferences?.show_credits_card !== false
  );
  const [showSavingsCard, setShowSavingsCard] = useState<boolean>(
    profile?.dashboard_preferences?.show_savings_card !== false
  );
  const [showExpenseStats, setShowExpenseStats] = useState<boolean>(
    profile?.dashboard_preferences?.show_expense_stats !== false
  );
  const [showCharts, setShowCharts] = useState<boolean>(
    profile?.dashboard_preferences?.show_charts !== false
  );
  const [showContributors, setShowContributors] = useState<boolean>(
    profile?.dashboard_preferences?.show_contributors !== false
  );
  
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const queryClient = useQueryClient();

  // Fonction pour mettre à jour les préférences dans la base de données
  const updatePreferences = async (preferences: DashboardPreferences) => {
    if (!profile?.id) return;

    setIsUpdating(true);
    try {
      // Convertir explicitement l'objet de préférences en un objet simple pour Supabase
      const preferencesForDB: Record<string, boolean> = {
        show_revenue_card: preferences.show_revenue_card ?? true,
        show_expenses_card: preferences.show_expenses_card ?? true,
        show_credits_card: preferences.show_credits_card ?? true,
        show_savings_card: preferences.show_savings_card ?? true,
        show_expense_stats: preferences.show_expense_stats ?? true,
        show_charts: preferences.show_charts ?? true,
        show_contributors: preferences.show_contributors ?? true
      };

      const { error } = await supabase
        .from("profiles")
        .update({ dashboard_preferences: preferencesForDB })
        .eq("id", profile.id);

      if (error) throw error;
      
      // Invalider le cache pour forcer un rechargement
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["current-profile"] });
      
      toast.success("Préférences du tableau de bord mises à jour");
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour des préférences:", error);
      toast.error("Erreur lors de la mise à jour des préférences");
    } finally {
      setIsUpdating(false);
    }
  };

  // Gestionnaires pour chaque toggle
  const handleRevenueCardToggle = (checked: boolean) => {
    setShowRevenueCard(checked);
    updatePreferences({
      ...profile?.dashboard_preferences || defaultPreferences,
      show_revenue_card: checked
    });
  };

  const handleExpensesCardToggle = (checked: boolean) => {
    setShowExpensesCard(checked);
    updatePreferences({
      ...profile?.dashboard_preferences || defaultPreferences,
      show_expenses_card: checked
    });
  };

  const handleCreditsCardToggle = (checked: boolean) => {
    setShowCreditsCard(checked);
    updatePreferences({
      ...profile?.dashboard_preferences || defaultPreferences,
      show_credits_card: checked
    });
  };

  const handleSavingsCardToggle = (checked: boolean) => {
    setShowSavingsCard(checked);
    updatePreferences({
      ...profile?.dashboard_preferences || defaultPreferences,
      show_savings_card: checked
    });
  };

  const handleExpenseStatsToggle = (checked: boolean) => {
    setShowExpenseStats(checked);
    updatePreferences({
      ...profile?.dashboard_preferences || defaultPreferences,
      show_expense_stats: checked
    });
  };

  const handleChartsToggle = (checked: boolean) => {
    setShowCharts(checked);
    updatePreferences({
      ...profile?.dashboard_preferences || defaultPreferences,
      show_charts: checked
    });
  };

  const handleContributorsToggle = (checked: boolean) => {
    setShowContributors(checked);
    updatePreferences({
      ...profile?.dashboard_preferences || defaultPreferences,
      show_contributors: checked
    });
  };

  return {
    showRevenueCard,
    showExpensesCard,
    showCreditsCard,
    showSavingsCard,
    showExpenseStats,
    showCharts,
    showContributors,
    isUpdating,
    handleRevenueCardToggle,
    handleExpensesCardToggle,
    handleCreditsCardToggle,
    handleSavingsCardToggle,
    handleExpenseStatsToggle,
    handleChartsToggle,
    handleContributorsToggle
  };
};
