
import { ReactNode, useEffect } from "react";
import { useAuthStateListener } from "@/hooks/useAuthStateListener";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { processAuthAction } from "@/utils/authActions";

interface AuthWrapperProps {
  children: ReactNode;
}

export const AuthWrapper = ({ children }: AuthWrapperProps) => {
  const queryClient = useQueryClient();

  // Écouter les changements d'état d'authentification
  useAuthStateListener();

  // Traiter les actions d'authentification dans l'URL
  useEffect(() => {
    processAuthAction();
  }, []);

  // Force le rechargement des données utilisateur au démarrage
  useEffect(() => {
    const loadInitialUserData = async () => {
      try {
        // Vérifier si l'utilisateur est déjà connecté
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          console.log("Utilisateur déjà connecté:", user.email);
          
          // Forcer l'invalidation des requêtes liées à l'utilisateur
          queryClient.invalidateQueries({ queryKey: ["current-user"] });
          queryClient.invalidateQueries({ queryKey: ["user-profile"] });
          queryClient.invalidateQueries({ queryKey: ["profile"] });
          queryClient.invalidateQueries({ queryKey: ["isAdmin"] });
        } else {
          console.log("Aucun utilisateur connecté au démarrage");
        }
      } catch (error) {
        console.error("Erreur lors du chargement initial:", error);
        toast.error("Erreur de connexion au serveur");
      }
    };
    
    loadInitialUserData();
  }, [queryClient]);

  return <>{children}</>;
};
