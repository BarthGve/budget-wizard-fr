
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useCurrentUser = () => {
  const { data: currentUser, isLoading, error } = useQuery({
    queryKey: ["current-user"], // Clé standardisée
    queryFn: async () => {
      // Vérifier d'abord dans sessionStorage si on est authentifié
      const isAuthenticatedInSession = sessionStorage.getItem('is_authenticated') === 'true';
      
      // Si on n'est pas authentifié selon sessionStorage, on vérifie avec Supabase
      const { data: { user }, error } = await supabase.auth.getUser();
      
      // Mettre à jour sessionStorage avec l'état d'authentification réel
      if (user) {
        sessionStorage.setItem('is_authenticated', 'true');
      } else {
        sessionStorage.removeItem('is_authenticated');
      }
      
      if (error) throw error;
      if (!user) throw new Error("Non authentifié");
      return user;
    },
    staleTime: 1000 * 30, // Réduit à 30 secondes
    retry: 1,
    // Utiliser les données en cache en cas d'erreur lors du rechargement
    placeholderData: undefined
  });

  return { 
    currentUser, 
    isLoading,
    isAuthenticated: !!currentUser,
    error 
  };
};
