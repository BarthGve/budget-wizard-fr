
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

/**
 * Composant qui écoute les changements d'état d'authentification
 * et nettoie le cache React Query en conséquence
 */
export const AuthListener = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Écouteur d'événement pour les changements d'authentification
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event);
        
        if (event === "SIGNED_IN") {
          // Nouvel utilisateur connecté, on vide complètement le cache
          queryClient.clear();
          toast.success("Connecté avec succès");
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
      }
    );

    // Nettoyage à la désactivation du composant
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [queryClient]);

  // Ce composant ne rend rien
  return null;
};
