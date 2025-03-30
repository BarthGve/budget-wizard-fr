
import { Profile } from "@/types/profile";
import { mergeDashboardPreferences } from "@/utils/dashboard-preferences";

/**
 * Hook pour résoudre les préférences du tableau de bord à partir du profil utilisateur
 */
export const useDashboardPreferencesResolver = (profile: Profile | null | undefined) => {
  try {
    // Assurons-nous que le profil et ses préférences sont bien typés
    // Le cast explicite aide TypeScript à comprendre que nous gérons la conversion
    const preferencesObject = profile?.dashboard_preferences || null;
    const dashboardPrefs = mergeDashboardPreferences(preferencesObject);
    
    return {
      dashboardPrefs,
    };
  } catch (error) {
    console.error("Erreur lors du traitement des préférences du tableau de bord:", error);
    // En cas d'erreur, retourner les préférences par défaut
    return {
      dashboardPrefs: mergeDashboardPreferences(null),
    };
  }
};
