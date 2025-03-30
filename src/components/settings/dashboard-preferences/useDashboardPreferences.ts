
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

// Fonction utilitaire pour vérifier si un objet est du type DashboardPreferences
const isDashboardPreferences = (obj: any): obj is DashboardPreferences => {
  return obj !== null && 
         typeof obj === 'object' &&
         obj !== undefined &&
         // Vérifier que l'objet existe et est bien un objet avant de vérifier ses propriétés
         (
           'show_revenue_card' in obj ||
           'show_expenses_card' in obj ||
           'show_credits_card' in obj ||
           'show_savings_card' in obj ||
           'show_expense_stats' in obj ||
           'show_charts' in obj ||
           'show_contributors' in obj
         );
};

export const useDashboardPreferences = (profile: Profile | null | undefined) => {
  // Récupérer les préférences du profil ou utiliser les valeurs par défaut
  let profilePreferences;
  
  try {
    profilePreferences = profile?.dashboard_preferences && 
      isDashboardPreferences(profile.dashboard_preferences) ? 
      profile.dashboard_preferences : 
      defaultPreferences;
  } catch (error) {
    console.error("Erreur lors de l'accès aux préférences:", error);
    profilePreferences = defaultPreferences;
  }
    
  // Initialiser les états avec les valeurs du profil ou les valeurs par défaut
  const [showRevenueCard, setShowRevenueCard] = useState<boolean>(
    profilePreferences.show_revenue_card !== false
  );
  const [showExpensesCard, setShowExpensesCard] = useState<boolean>(
    profilePreferences.show_expenses_card !== false
  );
  const [showCreditsCard, setShowCreditsCard] = useState<boolean>(
    profilePreferences.show_credits_card !== false
  );
  const [showSavingsCard, setShowSavingsCard] = useState<boolean>(
    profilePreferences.show_savings_card !== false
  );
  const [showExpenseStats, setShowExpenseStats] = useState<boolean>(
    profilePreferences.show_expense_stats !== false
  );
  const [showCharts, setShowCharts] = useState<boolean>(
    profilePreferences.show_charts !== false
  );
  const [showContributors, setShowContributors] = useState<boolean>(
    profilePreferences.show_contributors !== false
  );
  
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const queryClient = useQueryClient();

  // Fonction pour mettre à jour les préférences dans la base de données
  const updatePreferences = async (preferences: DashboardPreferences) => {
    if (!profile?.id) return;

    setIsUpdating(true);
    try {
      // Convertir explicitement l'objet de préférences en un objet simple pour Supabase
      // Cette étape est cruciale pour s'assurer que les données sont correctement typées pour PostgreSQL
      const preferencesForDB = {
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
    try {
      // Créer une copie des préférences existantes ou par défaut
      const updatedPreferences = {
        ...defaultPreferences,
        ...(isDashboardPreferences(profile?.dashboard_preferences) ? profile.dashboard_preferences : {}),
        show_revenue_card: checked
      };
      updatePreferences(updatedPreferences);
    } catch (error) {
      console.error("Erreur lors de la mise à jour des préférences:", error);
      toast.error("Erreur lors de la mise à jour des préférences");
    }
  };

  const handleExpensesCardToggle = (checked: boolean) => {
    setShowExpensesCard(checked);
    try {
      const updatedPreferences = {
        ...defaultPreferences,
        ...(isDashboardPreferences(profile?.dashboard_preferences) ? profile.dashboard_preferences : {}),
        show_expenses_card: checked
      };
      updatePreferences(updatedPreferences);
    } catch (error) {
      console.error("Erreur lors de la mise à jour des préférences:", error);
      toast.error("Erreur lors de la mise à jour des préférences");
    }
  };

  const handleCreditsCardToggle = (checked: boolean) => {
    setShowCreditsCard(checked);
    try {
      const updatedPreferences = {
        ...defaultPreferences,
        ...(isDashboardPreferences(profile?.dashboard_preferences) ? profile.dashboard_preferences : {}),
        show_credits_card: checked
      };
      updatePreferences(updatedPreferences);
    } catch (error) {
      console.error("Erreur lors de la mise à jour des préférences:", error);
      toast.error("Erreur lors de la mise à jour des préférences");
    }
  };

  const handleSavingsCardToggle = (checked: boolean) => {
    setShowSavingsCard(checked);
    try {
      const updatedPreferences = {
        ...defaultPreferences,
        ...(isDashboardPreferences(profile?.dashboard_preferences) ? profile.dashboard_preferences : {}),
        show_savings_card: checked
      };
      updatePreferences(updatedPreferences);
    } catch (error) {
      console.error("Erreur lors de la mise à jour des préférences:", error);
      toast.error("Erreur lors de la mise à jour des préférences");
    }
  };

  const handleExpenseStatsToggle = (checked: boolean) => {
    setShowExpenseStats(checked);
    try {
      const updatedPreferences = {
        ...defaultPreferences,
        ...(isDashboardPreferences(profile?.dashboard_preferences) ? profile.dashboard_preferences : {}),
        show_expense_stats: checked
      };
      updatePreferences(updatedPreferences);
    } catch (error) {
      console.error("Erreur lors de la mise à jour des préférences:", error);
      toast.error("Erreur lors de la mise à jour des préférences");
    }
  };

  const handleChartsToggle = (checked: boolean) => {
    setShowCharts(checked);
    try {
      const updatedPreferences = {
        ...defaultPreferences,
        ...(isDashboardPreferences(profile?.dashboard_preferences) ? profile.dashboard_preferences : {}),
        show_charts: checked
      };
      updatePreferences(updatedPreferences);
    } catch (error) {
      console.error("Erreur lors de la mise à jour des préférences:", error);
      toast.error("Erreur lors de la mise à jour des préférences");
    }
  };

  const handleContributorsToggle = (checked: boolean) => {
    setShowContributors(checked);
    try {
      const updatedPreferences = {
        ...defaultPreferences,
        ...(isDashboardPreferences(profile?.dashboard_preferences) ? profile.dashboard_preferences : {}),
        show_contributors: checked
      };
      updatePreferences(updatedPreferences);
    } catch (error) {
      console.error("Erreur lors de la mise à jour des préférences:", error);
      toast.error("Erreur lors de la mise à jour des préférences");
    }
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
