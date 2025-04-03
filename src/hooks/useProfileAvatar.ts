
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useProfileAvatar = () => {
  const queryClient = useQueryClient();
  
  // Récupère d'abord l'utilisateur actuel pour avoir son ID
  const { data: currentUser } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
    staleTime: 0, // Forcer un rafraîchissement à chaque utilisation
  });

  // Utilise l'ID de l'utilisateur actuel dans la clé de requête
  return useQuery({
    queryKey: ["profile-avatar", currentUser?.id],
    queryFn: async () => {
      if (!currentUser) return null;

      // Forcer l'invalidation des autres requêtes liées au profil
      queryClient.invalidateQueries({ queryKey: ["profile"] });

      const { data } = await supabase
        .from("profiles")
        .select("avatar_url")
        .eq("id", currentUser.id)
        .single();

      return data;
    },
    enabled: !!currentUser,
    staleTime: 0, // Forcer un rafraîchissement à chaque utilisation
  });
};
