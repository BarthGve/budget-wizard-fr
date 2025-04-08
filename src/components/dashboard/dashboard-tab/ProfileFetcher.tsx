
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types/profile";
import { useAuthContext } from "@/context/AuthProvider";

/**
 * Hook qui récupère le profil utilisateur courant
 */
export const useProfileFetcher = () => {
  const { user, isAuthenticated } = useAuthContext();
  
  return useQuery({
    queryKey: ["current-profile"],
    queryFn: async () => {
      // Utiliser l'utilisateur du contexte d'authentification si disponible
      if (!user || !isAuthenticated) {
        console.log("ProfileFetcher: Aucun utilisateur authentifié");
        return null;
      }
      
      console.log("ProfileFetcher: Récupération du profil pour", user.id);
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return null;
      }

      // Vérification et transformation des préférences si nécessaire
      if (data && data.dashboard_preferences) {
        try {
          // Si les préférences sont stockées en tant que chaîne, les parser
          if (typeof data.dashboard_preferences === 'string') {
            data.dashboard_preferences = JSON.parse(data.dashboard_preferences);
          }
        } catch (e) {
          console.error("Erreur lors du parsing des préférences du tableau de bord:", e);
          // En cas d'erreur, définir les préférences à null pour utiliser les valeurs par défaut
          data.dashboard_preferences = null;
        }
      }

      // S'assurer que l'email est bien présent dans les données du profil
      const profileData = data as Profile;
      if (profileData && user.email && !profileData.hasOwnProperty('email')) {
        profileData.email = user.email;
      }

      // S'assurer que les données retournées sont conformes au type Profile
      return profileData;
    },
    enabled: !!user && isAuthenticated, // N'exécuter que si l'utilisateur est authentifié
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};
