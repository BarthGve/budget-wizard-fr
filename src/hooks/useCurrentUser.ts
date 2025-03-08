
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useCurrentUser = () => {
  const { data: currentUser, isLoading, error } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      if (!user) throw new Error("Non authentifié");
      return user;
    },
    staleTime: 1000 * 60 * 5, // Cache de 5 minutes pour l'utilisateur
  });

  // Vérifier si l'utilisateur est admin
  const { data: isAdmin = false } = useQuery({
    queryKey: ["is-admin", currentUser?.id],
    queryFn: async () => {
      if (!currentUser) return false;
      
      const { data, error } = await supabase.rpc('has_role', {
        user_id: currentUser.id,
        role: 'admin'
      });
      
      if (error) {
        console.error('Erreur lors de la vérification du rôle admin:', error);
        return false;
      }
      
      return !!data;
    },
    enabled: !!currentUser,
    staleTime: 1000 * 60 * 5, // Cache de 5 minutes
  });

  return { 
    currentUser, 
    isAdmin,
    isLoading,
    error
  };
};
