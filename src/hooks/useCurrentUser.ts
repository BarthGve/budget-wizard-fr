
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/context/AuthProvider";

export const useCurrentUser = () => {
  const { user: authUser, isAuthenticated, loading: authLoading } = useAuthContext();
  
  const { data: currentUser, isLoading, error } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      // Éviter les appels inutiles si l'authentification est en cours de chargement
      if (authLoading) {
        console.log("useCurrentUser: attente de l'état d'authentification...");
        return null;
      }
      
      // D'abord essayer d'utiliser le contexte d'authentification
      if (authUser) {
        console.log("useCurrentUser: utilisateur récupéré depuis le contexte d'auth");
        return authUser;
      }
      
      // Fallback à la récupération via Supabase si nécessaire
      console.log("useCurrentUser: tentative de récupération via Supabase");
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error("Erreur lors de la récupération de l'utilisateur:", error);
        throw error;
      }
      
      if (!user) {
        console.log("useCurrentUser: aucun utilisateur trouvé");
        return null;
      }
      
      console.log("useCurrentUser: utilisateur récupéré via Supabase");
      return user;
    },
    enabled: isAuthenticated || !authLoading, // N'exécuter que si l'authentification est terminée
    staleTime: 60000, // Réduit les rafraîchissements trop fréquents (1 minute)
    retry: false, // Ne pas retenter en cas d'échec
    refetchOnWindowFocus: false, // Ne pas rafraîchir à chaque focus de fenêtre
  });

  return { 
    currentUser, 
    isLoading: isLoading || authLoading,
    isAuthenticated,
    error 
  };
};
