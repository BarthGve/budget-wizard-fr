
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useCurrentUser = () => {
  const { data: currentUser, isLoading } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      if (!user) throw new Error("Non authentifié");
      
      // Vérifier si l'utilisateur est admin
      const { data: isAdmin } = await supabase.rpc('has_role', {
        user_id: user.id,
        role: 'admin'
      });
      
      return { ...user, isAdmin };
    },
    staleTime: 1000 * 60 * 5, // Cache de 5 minutes pour l'utilisateur
  });

  return { currentUser, isLoading };
};
