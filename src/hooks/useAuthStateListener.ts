
import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";

/**
 * Hook qui gère les changements d'état d'authentification
 * et met à jour le cache React Query en conséquence
 */
export const useAuthStateListener = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const isInitialMount = useRef(true);
  const previousAuthState = useRef<boolean | null>(null);
  const navigationInProgress = useRef(false);

  useEffect(() => {
    // Configuration de l'écouteur d'événements pour les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Événement d'authentification détecté:", event);
        
        // Skip initial session check to avoid double navigation
        if (isInitialMount.current && event === "INITIAL_SESSION") {
          isInitialMount.current = false;
          
          // Store initial auth state
          previousAuthState.current = !!session;
          return;
        }

        // Important: Avoid unnecessary cache invalidations if auth state didn't actually change
        const currentAuthState = !!session;
        if (previousAuthState.current === currentAuthState && event !== "SIGNED_OUT" && event !== "USER_UPDATED") {
          return;
        }
        
        previousAuthState.current = currentAuthState;

        if (event === "SIGNED_IN") {
          // Vérifier si l'utilisateur vient de vérifier son email
          const justVerified = localStorage.getItem("justVerified") === "true";
          
          // Invalidation simple des caches pertinents
          queryClient.invalidateQueries({ queryKey: ["auth"] });
          queryClient.invalidateQueries({ queryKey: ["current-user"] });
          queryClient.invalidateQueries({ queryKey: ["profile"] });
          
          // Si l'utilisateur est déjà sur la page de login et vient juste de vérifier son email,
          // on le redirige vers le dashboard
          if (location.pathname === "/login" && justVerified) {
            localStorage.removeItem("justVerified");
            navigate("/dashboard");
          }
        } else if (event === "USER_UPDATED") {
          // Gérer la mise à jour du profil utilisateur
          console.log("Profil utilisateur mis à jour");
          
          // Vérifier s'il s'agit d'une confirmation de changement d'email
          if (session?.user?.email) {
            console.log("Email mis à jour:", session.user.email);
            
            // Invalider les requêtes pour rafraîchir les données
            queryClient.invalidateQueries({ queryKey: ["auth"] });
            queryClient.invalidateQueries({ queryKey: ["current-user"] });
            queryClient.invalidateQueries({ queryKey: ["profile"] });
            
            // Vérifier si le changement provient d'un lien de changement d'email
            // en regardant soit le hash, soit les paramètres d'URL, soit le localStorage
            if (location.hash.includes("type=email_change") || 
                location.search.includes("type=emailChange") ||
                localStorage.getItem("verificationEmail")) {
                
              console.log("Confirmation de changement d'email détectée");
              
              // Nettoyer l'URL
              if (window.history && window.history.replaceState) {
                window.history.replaceState({}, document.title, window.location.pathname);
              }
              
              // Nettoyer le localStorage
              localStorage.removeItem("verificationEmail");
              
              // Informer l'utilisateur
              toast.success("Votre adresse email a été mise à jour avec succès");
              
              // Rediriger vers les paramètres utilisateur
              setTimeout(() => {
                navigate("/user-settings");
              }, 500);
            }
          }
        } else if (event === "SIGNED_OUT") {
          try {
            // Éviter la navigation multiple
            if (navigationInProgress.current) return;
            navigationInProgress.current = true;
            
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
  }, [queryClient, navigate, location.pathname, location.hash, location.search]);

  return {
    isInitialMount,
  };
};
