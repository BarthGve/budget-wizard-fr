
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

/**
 * Composant qui écoute les changements d'état d'authentification
 * et met à jour le cache React Query en conséquence
 */
export const AuthListener = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Écouteur d'événement pour les changements d'authentification
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session ? "with session" : "no session");
        
        if (event === "SIGNED_IN") {
          // Nouvel utilisateur connecté, on invalide certaines requêtes clés
          queryClient.invalidateQueries({ queryKey: ["auth"] });
          queryClient.invalidateQueries({ queryKey: ["profile"] });
          queryClient.invalidateQueries({ queryKey: ["current-user"] });
          toast.success("Connecté avec succès");
        } else if (event === "SIGNED_OUT") {
          // Utilisateur déconnecté, on vide complètement le cache
          // mais sans déclencher de requêtes inutiles
          queryClient.clear();
          toast.info("Déconnecté");
        } else if (event === "USER_UPDATED") {
          // Utilisateur mis à jour, on invalide seulement les requêtes liées au profil
          queryClient.invalidateQueries({ queryKey: ["profile"] });
          queryClient.invalidateQueries({ queryKey: ["current-user"] });
          toast.info("Profil mis à jour");
        } else if (event === "TOKEN_REFRESHED") {
          // Token rafraîchi, mise à jour des données sensibles
          queryClient.invalidateQueries({ queryKey: ["isAdmin"] });
          queryClient.invalidateQueries({ queryKey: ["auth"] });
        } else if (event === "INITIAL_SESSION") {
          // Session initiale, on ne fait rien de spécial pour éviter
          // de déclencher trop de requêtes simultanées au chargement
          console.log("Session initiale détectée");
          if (session) {
            // Si on a une session, on met quand même à jour les requêtes d'auth pour avoir les données à jour
            queryClient.invalidateQueries({ queryKey: ["auth"] });
            queryClient.invalidateQueries({ queryKey: ["profile"] });
          }
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
