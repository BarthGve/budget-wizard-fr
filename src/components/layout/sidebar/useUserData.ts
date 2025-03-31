
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types/profile";

export const useUserData = () => {
  // Récupération de l'utilisateur courant
  const { data: currentUser } = useQuery({
    queryKey: ["current-user"], // Utilisation d'une clé standardisée
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
    staleTime: 1000 * 30, // Réduit à 30 secondes au lieu de 60
  });

  // Récupération du profil
  const { data: profile } = useQuery<Profile>({
    queryKey: ["profile", currentUser?.id], // Utilisation d'une clé standardisée
    queryFn: async () => {
      if (!currentUser) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", currentUser.id)
        .single();

      if (error) throw error;

      const profileData = {
        ...data,
        email: currentUser.email
      } as Profile;

      return profileData;
    },
    enabled: !!currentUser,
    staleTime: 1000 * 30, // Réduit à 30 secondes au lieu de 60
  });

  // Vérification du rôle admin
  const { data: isAdmin } = useQuery({
    queryKey: ["isAdmin", currentUser?.id], // Utilisation d'une clé standardisée
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
    staleTime: 1000 * 30, // Réduit à 30 secondes au lieu de 60
  });

  return {
    currentUser,
    profile,
    isAdmin: isAdmin || false
  };
};
