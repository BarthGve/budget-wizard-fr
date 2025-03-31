
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types/profile";

export const useUserData = () => {
  const queryClient = useQueryClient();
  
  // Récupération de l'utilisateur courant
  const { data: currentUser } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
    staleTime: 0, // Forcer un rafraîchissement à chaque utilisation
  });

  // Récupération du profil
  const { data: profile } = useQuery<Profile>({
    queryKey: ["user-profile", currentUser?.id],
    queryFn: async () => {
      if (!currentUser) throw new Error("User not authenticated");

      console.log("Récupération du profil pour l'utilisateur:", currentUser.id, currentUser.email);

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", currentUser.id)
        .single();

      if (error) {
        console.error("Erreur lors de la récupération du profil:", error);
        throw error;
      }

      const profileData = {
        ...data,
        email: currentUser.email
      } as Profile;

      return profileData;
    },
    enabled: !!currentUser,
    staleTime: 0, // Forcer un rafraîchissement à chaque utilisation
  });

  // Vérification du rôle admin
  const { data: isAdmin } = useQuery({
    queryKey: ["isAdmin", currentUser?.id],
    queryFn: async () => {
      if (!currentUser) return false;

      const { data, error } = await supabase.rpc('has_role', {
        user_id: currentUser.id,
        role: 'admin'
      });

      if (error) throw error;
      return data;
    },
    enabled: !!currentUser,
    staleTime: 0, // Forcer un rafraîchissement à chaque utilisation
  });

  return {
    currentUser,
    profile,
    isAdmin: isAdmin || false
  };
};
