import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

/**
 * Composant qui écoute les changements d'état d'authentification
 * et met à jour le cache React Query en conséquence de manière optimisée
 */
export const AuthListener = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const isInitialMount = useRef(true);
  const previousAuthState = useRef<boolean | null>(null);

  useEffect(() => {
    // Configuration de l'écouteur d'événements pour les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session ? "User logged in" : "User logged out");

        // Skip initial session check to avoid double navigation
        if (isInitialMount.current && event === "INITIAL_SESSION") {
          isInitialMount.current = false;
          
          // Store initial auth state
          previousAuthState.current = !!session;
          return;
        }

        // Important: Avoid unnecessary cache invalidations if auth state didn't actually change
        const currentAuthState = !!session;
        if (previousAuthState.current === currentAuthState && event !== "SIGNED_OUT") {
          console.log("Auth state didn't change, skipping cache invalidation");
          return;
        }
        
        previousAuthState.current = currentAuthState;

        if (event === "SIGNED_IN") {
          // Invalider le cache de manière sélective avec des requêtes ciblées
          queryClient.invalidateQueries({ queryKey: ["auth"], exact: true });
          queryClient.invalidateQueries({ queryKey: ["current-user"], exact: true });
          queryClient.invalidateQueries({ queryKey: ["profile"], exact: true });
          // Ne pas naviguer ici pour éviter les rechargements complets
        } else if (event === "SIGNED_OUT") {
          try {
            // Liste des clés de cache spécifiques à supprimer
            const keysToRemove = [
              "auth", 
              "current-user", 
              "profile", 
              "contributors", 
              "expenses", 
              "recurring-expenses",
              "recurring-expense-categories",
              "credits",
              "credits-monthly-stats"
            ];
            
            // Supprimer les entrées spécifiques au lieu de vider tout le cache
            keysToRemove.forEach(key => {
              queryClient.removeQueries({ queryKey: [key], exact: true });
            });
            
            // Rediriger vers la page de connexion de manière programmatique
            // Utiliser navigate au lieu de window.location pour éviter un rechargement complet
            navigate("/", { replace: true });
          } catch (error) {
            console.error("Error during sign out handling:", error);
          }
        }
      }
    );

    // Nettoyage à la désinstallation du composant
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [queryClient, navigate]);

  return null;
};
