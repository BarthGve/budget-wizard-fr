
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/context/AuthProvider";

export const useCurrentUser = () => {
  const { user: authUser, isAuthenticated } = useAuthContext();
  
  const { data: currentUser, isLoading, error } = useQuery({
    queryKey: ["current-user"], // Clé standardisée
    queryFn: async () => {
      // D'abord essayer d'utiliser le contexte d'authentification
      if (authUser) {
        return authUser;
      }
      
      // Fallback à la récupération via Supabase si nécessaire
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error("Erreur lors de la récupération de l'utilisateur:", error);
        throw error;
      }
      
      if (!user) throw new Error("Non authentifié");
      return user;
    },
    enabled: isAuthenticated, // N'exécuter que si l'utilisateur est authentifié via le contexte
    staleTime: 0, // Forcer un rafraîchissement à chaque utilisation
    retry: 1,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });

  return { 
    currentUser, 
    isLoading,
    isAuthenticated,
    error 
  };
};
