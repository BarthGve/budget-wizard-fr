
import { Profile } from "@/types/profile";
import { mergeDashboardPreferences, defaultDashboardPreferences } from "@/utils/dashboard-preferences";

/**
 * Hook pour résoudre les préférences du tableau de bord à partir du profil utilisateur
 */
export const useDashboardPreferencesResolver = (profile: Profile | null | undefined) => {
  try {
    // Vérification plus stricte du profil et des préférences
    if (!profile) {
      return {
        dashboardPrefs: defaultDashboardPreferences,
      };
    }

    // Gérer explicitement le cas où dashboard_preferences pourrait être null, undefined, 
    // un objet, ou même une chaîne JSON
    const preferencesObject = profile.dashboard_preferences;
    const dashboardPrefs = mergeDashboardPreferences(preferencesObject);
    
    return {
      dashboardPrefs,
    };
  } catch (error) {
    console.error("Erreur lors du traitement des préférences du tableau de bord:", error);
    // En cas d'erreur, retourner les préférences par défaut
    return {
      dashboardPrefs: defaultDashboardPreferences,
    };
  }
};
