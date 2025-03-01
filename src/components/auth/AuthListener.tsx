
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

/**
 * Composant qui écoute les changements d'état d'authentification
 * et nettoie le cache React Query en conséquence
 */
export const AuthListener = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    // État pour suivre si c'est la première initialisation
    let isInitialLoad = true;
    
    // Écouteur d'événement pour les changements d'authentification
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event);
        
        if (event === "SIGNED_IN") {
          if (!isInitialLoad) {
            // Seulement si ce n'est pas le chargement initial
            // On invalide les requêtes au lieu de vider complètement le cache
            queryClient.invalidateQueries({ queryKey: ["auth"] });
            queryClient.invalidateQueries({ queryKey: ["profile"] });
            queryClient.invalidateQueries({ queryKey: ["current-user"] });
            queryClient.invalidateQueries({ queryKey: ["isAdmin"] });
            
            toast.success("Connecté avec succès");
            navigate("/dashboard", { replace: true });
          }
        } else if (event === "SIGNED_OUT") {
          // Utilisateur déconnecté, on vide complètement le cache
          queryClient.clear();
        } else if (event === "USER_UPDATED") {
          // Utilisateur mis à jour, on invalide les requêtes liées au profil
          queryClient.invalidateQueries({ queryKey: ["profile"] });
          queryClient.invalidateQueries({ queryKey: ["current-user"] });
        } else if (event === "TOKEN_REFRESHED") {
          // Token rafraîchi, pourrait signifier un changement de rôle ou autres
          queryClient.invalidateQueries({ queryKey: ["isAdmin"] });
          queryClient.invalidateQueries({ queryKey: ["auth"] });
        }
        
        // Après le premier événement, on considère que ce n'est plus le chargement initial
        isInitialLoad = false;
      }
    );

    // Nettoyage à la désactivation du composant
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [queryClient, navigate]);

  // Ce composant ne rend rien
  return null;
};
