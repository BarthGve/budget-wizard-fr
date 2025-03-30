
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Profile, DashboardPreferences } from "@/types/profile";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createUpdatedPreferences } from "@/utils/dashboard-preference-utils";

export const usePreferenceUpdater = (profile: Profile | null | undefined) => {
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const queryClient = useQueryClient();

  // Fonction pour mettre à jour les préférences dans la base de données
  const updatePreferences = async (preferences: DashboardPreferences) => {
    if (!profile?.id) return;

    setIsUpdating(true);
    try {
      // Convertir explicitement l'objet de préférences en un objet simple pour Supabase
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

  // Fonction générique pour gérer les basculements de toggle
  const handleToggle = (key: keyof DashboardPreferences, checked: boolean) => {
    try {
      const updatedPreferences = createUpdatedPreferences(profile?.dashboard_preferences, key, checked);
      updatePreferences(updatedPreferences);
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la préférence ${String(key)}:`, error);
      toast.error("Erreur lors de la mise à jour des préférences");
    }
  };

  return {
    isUpdating,
    handleToggle,
    updatePreferences
  };
};
