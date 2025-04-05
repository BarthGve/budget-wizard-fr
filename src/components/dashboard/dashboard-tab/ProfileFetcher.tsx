
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types/profile";
import { mergeDashboardPreferences } from "@/utils/dashboard-preferences";

/**
 * Hook qui récupère le profil utilisateur courant
 */
export const useProfileFetcher = () => {
  return useQuery({
    queryKey: ["current-profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return null;
      }

      // Traitement spécifique des préférences du tableau de bord
      if (data) {
        // Conversion explicite des préférences JSON en objet DashboardPreferences
        if (data.dashboard_preferences) {
          try {
            // Si les préférences sont stockées en tant que chaîne, les parser
            if (typeof data.dashboard_preferences === 'string') {
              data.dashboard_preferences = JSON.parse(data.dashboard_preferences);
            }
            
            // Fusionner avec les préférences par défaut pour garantir la structure complète
            // Attention: avec un casting pour gérer le problème de type
            const mergedPreferences = mergeDashboardPreferences(data.dashboard_preferences);
            
            // Conserver l'objet en tant que Json avec un casting explicite
            data.dashboard_preferences = mergedPreferences as any;
          } catch (e) {
            console.error("Erreur lors du parsing des préférences du tableau de bord:", e);
            // En cas d'erreur, définir les préférences à null pour utiliser les valeurs par défaut
            data.dashboard_preferences = null;
          }
        }
      }

      // S'assurer que les données retournées sont conformes au type Profile
      return data as Profile;
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
};
