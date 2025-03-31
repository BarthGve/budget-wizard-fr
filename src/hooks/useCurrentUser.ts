
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useCurrentUser = () => {
  const { data: currentUser, isLoading, error } = useQuery({
    queryKey: ["current-user"], // Clé standardisée
    queryFn: async () => {
      // Utiliser une approche plus directe pour obtenir l'utilisateur courant
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error("Erreur lors de la récupération de l'utilisateur:", error);
        throw error;
      }
      
      if (!user) throw new Error("Non authentifié");
      return user;
    },
    staleTime: 0, // Forcer un rafraîchissement à chaque utilisation
    retry: 1,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });

  return { 
    currentUser, 
    isLoading,
    isAuthenticated: !!currentUser,
    error 
  };
};
