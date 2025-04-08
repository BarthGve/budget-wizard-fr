
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCallback } from "react";
import { toast } from "sonner";
import { useAuthContext } from "@/context/AuthProvider";

/**
 * Hook centralisé pour la gestion des données utilisateur et de session
 * Garantit que les données utilisateur sont correctement chargées et synchronisées
 */
export const useUserSession = () => {
  const queryClient = useQueryClient();
  const { user: authUser, isAuthenticated, loading: authLoading } = useAuthContext();

  // Fonction pour forcer le rafraîchissement des données utilisateur
  const refreshUserData = useCallback(async () => {
    try {
      console.log("useUserSession: Rafraîchissement des données utilisateur...");
      
      // Vérifier si l'utilisateur est authentifié via le contexte d'authentification
      if (!isAuthenticated || !authUser) {
        console.log("useUserSession: Aucun utilisateur authentifié trouvé lors du rafraîchissement");
        return null;
      }
      
      // Invalider explicitement toutes les requêtes liées à l'utilisateur
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["isAdmin"] });
      
      // Forcer un rafraîchissement immédiat des données
      await queryClient.refetchQueries({ 
        queryKey: ["profile"],
        exact: true,
        type: 'active'
      });
      
      console.log("useUserSession: Données utilisateur rafraîchies avec succès");
      return authUser;
    } catch (error) {
      console.error("useUserSession: Erreur lors du rafraîchissement des données utilisateur:", error);
      return null;
    }
  }, [queryClient, authUser, isAuthenticated]);

  // Récupération de l'utilisateur courant depuis le contexte d'auth
  const { 
    data: currentUser, 
    isLoading: isUserLoading, 
    error: userError 
  } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      console.log("useUserSession: Récupération de l'utilisateur courant...");
      
      // Éviter les appels inutiles si l'authentification est en cours de chargement
      if (authLoading) {
        console.log("useUserSession: attente de l'état d'authentification...");
        return null;
      }
      
      // Utiliser directement l'utilisateur du contexte d'authentification s'il est disponible
      if (authUser) {
        console.log("useUserSession: Utilisateur récupéré depuis le contexte d'auth");
        return authUser;
      }
      
      // Fallback à la récupération via Supabase si nécessaire
      console.log("useUserSession: Tentative de récupération via Supabase");
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error("useUserSession: Erreur lors de la récupération de l'utilisateur:", error);
        throw error;
      }
      
      if (!user) {
        console.log("useUserSession: Aucun utilisateur authentifié trouvé");
        return null;
      }
      
      console.log("useUserSession: Utilisateur authentifié trouvé:", user.id);
      return user;
    },
    retry: false,
    staleTime: 60000, // Réduire les appels trop fréquents (1 minute)
    enabled: isAuthenticated || !authLoading // N'exécuter que si l'authentification est terminée
  });

  // Récupération du profil utilisateur dépendant de currentUser
  const { 
    data: profile, 
    isLoading: isProfileLoading, 
    error: profileError 
  } = useQuery({
    queryKey: ["user-profile", currentUser?.id],
    queryFn: async () => {
      if (!currentUser) {
        console.log("useUserSession: Impossible de récupérer le profil: pas d'utilisateur");
        return null;
      }

      console.log("useUserSession: Récupération du profil pour:", currentUser.id);
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", currentUser.id)
        .single();

      if (error) {
        console.error("useUserSession: Erreur lors de la récupération du profil:", error);
        throw error;
      }

      console.log("useUserSession: Profil récupéré avec succès:", data?.full_name);
      return {
        ...data,
        email: currentUser.email
      };
    },
    enabled: !!currentUser && isAuthenticated, // N'exécuter que si l'utilisateur est authentifié et disponible
    retry: 1,
    staleTime: 60000, // Réduire les appels trop fréquents (1 minute)
    refetchOnWindowFocus: false,
  });

  // Vérification du rôle admin
  const { 
    data: isAdmin, 
    isLoading: isAdminLoading 
  } = useQuery({
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
    enabled: !!currentUser && isAuthenticated,
    retry: 1,
    staleTime: 60000, // Réduire les appels trop fréquents (1 minute)
    refetchOnWindowFocus: false,
  });

  // Effet pour gérer les erreurs et afficher des notifications
  if (userError) {
    console.error("useUserSession: Erreur de récupération utilisateur:", userError);
    // Éviter les notifications en boucle avec une vérification d'état
    if (isAuthenticated) {
      toast.error("Problème de connexion. Veuillez vous reconnecter.");
    }
  }
  
  if (profileError) {
    console.error("useUserSession: Erreur de récupération profil:", profileError);
    // Éviter les notifications en boucle
    if (isAuthenticated && currentUser) {
      toast.error("Impossible de charger votre profil.");
    }
  }

  return {
    currentUser,
    profile,
    isAdmin,
    isLoading: isUserLoading || isProfileLoading || isAdminLoading || authLoading,
    error: userError || profileError,
    refreshUserData,
    isAuthenticated
  };
};
