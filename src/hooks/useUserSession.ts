
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCallback, useEffect } from "react";
import { toast } from "sonner";

/**
 * Hook centralisé pour la gestion des données utilisateur et de session
 * Garantit que les données utilisateur sont correctement chargées et synchronisées
 */
export const useUserSession = () => {
  const queryClient = useQueryClient();

  // Fonction pour forcer le rafraîchissement des données utilisateur
  const refreshUserData = useCallback(async () => {
    try {
      console.log("useUserSession: Rafraîchissement des données utilisateur...");
      
      // Vérifier d'abord si l'utilisateur est authentifié
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
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
      return user;
    } catch (error) {
      console.error("useUserSession: Erreur lors du rafraîchissement des données utilisateur:", error);
      return null;
    }
  }, [queryClient]);

  // Récupération de l'utilisateur courant
  const { 
    data: currentUser, 
    isLoading: isUserLoading, 
    error: userError 
  } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      console.log("useUserSession: Récupération de l'utilisateur courant...");
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
    retry: 2,
    staleTime: 0, // Toujours récupérer les données récentes
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
    enabled: !!currentUser,
    retry: 2,
    staleTime: 0,
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
    enabled: !!currentUser,
    retry: 1,
    staleTime: 60000,
  });

  // Effet pour gérer les erreurs et afficher des notifications
  useEffect(() => {
    if (userError) {
      console.error("useUserSession: Erreur de récupération utilisateur:", userError);
      toast.error("Problème de connexion. Veuillez vous reconnecter.");
    }
    
    if (profileError) {
      console.error("useUserSession: Erreur de récupération profil:", profileError);
      toast.error("Impossible de charger votre profil.");
    }
  }, [userError, profileError]);

  // Écouter les événements d'authentification pour rafraîchir automatiquement les données
  useEffect(() => {
    // Écouter les changements d'état d'authentification
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("useUserSession: Événement d'authentification détecté:", event);
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
          console.log("useUserSession: Événement nécessitant un rafraîchissement des données");
          
          // Utiliser setTimeout pour éviter les deadlocks
          setTimeout(() => {
            refreshUserData();
          }, 50);
        }
      }
    );

    return () => {
      // Nettoyer l'écouteur lors du démontage
      authListener.subscription.unsubscribe();
    };
  }, [refreshUserData]);

  return {
    currentUser,
    profile,
    isAdmin,
    isLoading: isUserLoading || isProfileLoading || isAdminLoading,
    error: userError || profileError,
    refreshUserData,
    isAuthenticated: !!currentUser
  };
};
