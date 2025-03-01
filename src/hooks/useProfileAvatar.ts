
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useProfileAvatar = () => {
  // Récupère d'abord l'utilisateur actuel pour avoir son ID
  const { data: currentUser } = useQuery({
    queryKey: ["current-user-for-avatar"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Utilise l'ID de l'utilisateur actuel dans la clé de requête
  return useQuery({
    queryKey: ["profile-avatar", currentUser?.id],
    queryFn: async () => {
      if (!currentUser) return null;

      const { data } = await supabase
        .from("profiles")
        .select("avatar_url")
        .eq("id", currentUser.id)
        .single();

      return data;
    },
    enabled: !!currentUser,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
