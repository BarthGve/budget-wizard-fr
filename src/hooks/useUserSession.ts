
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
      console.log("Rafraîchissement des données utilisateur...");
      
      // Vérifier d'abord si l'utilisateur est authentifié
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log("Aucun utilisateur authentifié trouvé lors du rafraîchissement");
        return null;
      }
      
      // Invalider explicitement toutes les requêtes liées à l'utilisateur
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["isAdmin"] });
      
      return user;
    } catch (error) {
      console.error("Erreur lors du rafraîchissement des données utilisateur:", error);
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
      console.log("Récupération de l'utilisateur courant...");
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error("Erreur lors de la récupération de l'utilisateur:", error);
        throw error;
      }
      
      if (!user) {
        console.log("Aucun utilisateur authentifié trouvé");
        return null;
      }
      
      console.log("Utilisateur authentifié trouvé:", user.email);
      return user;
    },
    retry: 2,
    staleTime: 30000,
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
        console.log("Impossible de récupérer le profil: pas d'utilisateur");
        return null;
      }

      console.log("Récupération du profil pour:", currentUser.id, currentUser.email);
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", currentUser.id)
        .single();

      if (error) {
        console.error("Erreur lors de la récupération du profil:", error);
        throw error;
      }

      return {
        ...data,
        email: currentUser.email
      };
    },
    enabled: !!currentUser,
    retry: 2,
    staleTime: 30000,
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
      console.error("Erreur de récupération utilisateur:", userError);
      toast.error("Problème de connexion. Veuillez vous reconnecter.");
    }
    
    if (profileError) {
      console.error("Erreur de récupération profil:", profileError);
      toast.error("Impossible de charger votre profil.");
    }
  }, [userError, profileError]);

  // Automatiquement rafraîchir les données après un certain temps si elles sont vides
  useEffect(() => {
    if (!isUserLoading && !currentUser) {
      const timer = setTimeout(() => {
        console.log("Tentative automatique de récupération utilisateur...");
        refreshUserData();
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [currentUser, isUserLoading, refreshUserData]);

  return {
    currentUser,
    profile,
    isAdmin: isAdmin || false,
    isLoading: isUserLoading || isProfileLoading || isAdminLoading,
    error: userError || profileError,
    refreshUserData,
    isAuthenticated: !!currentUser
  };
};
