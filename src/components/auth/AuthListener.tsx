
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
  const navigationInProgress = useRef(false);

  useEffect(() => {
    // Configuration de l'écouteur d'événements pour les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
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
          return;
        }
        
        previousAuthState.current = currentAuthState;

        if (event === "SIGNED_IN") {
          // Réinitialiser les animations lorsqu'un utilisateur se connecte
          localStorage.removeItem('visitedPages');
          
          // Invalidation simple des caches pertinents
          queryClient.invalidateQueries({ queryKey: ["auth"] });
          queryClient.invalidateQueries({ queryKey: ["current-user"] });
          queryClient.invalidateQueries({ queryKey: ["profile"] });
        } else if (event === "SIGNED_OUT") {
          try {
            // Éviter la navigation multiple
            if (navigationInProgress.current) return;
            navigationInProgress.current = true;
            
            // Réinitialiser les animations lorsqu'un utilisateur se déconnecte
            localStorage.removeItem('visitedPages');
            
            // Invalidation simple des caches pertinents
            const keysToInvalidate = [
              "auth", 
              "current-user", 
              "profile", 
              "contributors", 
              "expenses", 
              "recurring-expenses",
              "recurring-expense-categories",
              "credits",
              "credits-monthly-stats",
              "savings"
            ];
            
            keysToInvalidate.forEach(key => {
              queryClient.invalidateQueries({ queryKey: [key] });
            });
            
            // Utiliser navigate avec replace pour éviter d'ajouter à l'historique
            navigate("/", { replace: true });
            
            // Réinitialiser le drapeau après un délai pour permettre la navigation complète
            setTimeout(() => {
              navigationInProgress.current = false;
            }, 200);
            
          } catch (error) {
            console.error("Error during sign out handling:", error);
            navigationInProgress.current = false;
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
