
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useCurrentUser = () => {
  const { data: currentUser, isLoading, error } = useQuery({
    queryKey: ["current-user"],
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
    staleTime: 1000 * 60 * 5, // Cache de 5 minutes pour l'utilisateur
    // Ne pas relancer en cas d'erreur - cela permet d'éviter des appels inutiles
    retry: 1,
    // Utiliser les données en cache en cas d'erreur lors du rechargement
    // pour maintenir l'expérience utilisateur SPA
    placeholderData: undefined // Remplacé keepPreviousData par undefined car nous n'avons pas besoin de cette fonctionnalité ici
  });

  return { 
    currentUser, 
    isLoading,
    isAuthenticated: !!currentUser,
    error 
  };
};
