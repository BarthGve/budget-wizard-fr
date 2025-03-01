
import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

/**
 * Composant qui écoute les changements d'état d'authentification
 * et met à jour le cache React Query en conséquence
 */
export const AuthListener = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const isInitialMount = useRef(true);

  useEffect(() => {
    // Configuration de l'écouteur d'événements pour les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session ? "User logged in" : "User logged out");

        // Skip initial session check to avoid double navigation
        if (isInitialMount.current && event === "INITIAL_SESSION") {
          isInitialMount.current = false;
          return;
        }

        if (event === "SIGNED_IN") {
          // Invalider le cache pour forcer un rechargement des données
          queryClient.invalidateQueries({ queryKey: ["current-user"] });
          // Ne pas naviguer ici pour éviter les rechargements complets
        } else if (event === "SIGNED_OUT") {
          try {
            // Vider le cache React Query
            queryClient.clear();
            
            // Rediriger explicitement vers la landing page avec replace: true
            navigate("/", { replace: true });
            
            // Forcer un rechargement des données de la landing page sans recharger toute la page
            setTimeout(() => {
              queryClient.invalidateQueries();
            }, 100);
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
