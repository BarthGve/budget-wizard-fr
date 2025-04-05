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
  const redirectTimeoutRef = useRef<number | null>(null);

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
          
          // Forcer un nettoyage complet du cache
          console.log("Forcer la réinitialisation du cache React Query pour le changement d'utilisateur");
          queryClient.clear();
          
          // Invalidation explicite des caches liés à l'utilisateur et au profil
          const keysToInvalidate = [
            "auth", 
            "current-user", 
            "profile", 
            "user-profile",
            "profile-avatar",
            "isAdmin", 
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
          
          // Si l'utilisateur est déjà sur la page de login et vient juste de vérifier son email,
          // on le redirige vers le dashboard
          if (location.pathname === "/login" && justVerified) {
            localStorage.removeItem("justVerified");
            
            // Éviter les redirections multiples
            if (!navigationInProgress.current) {
              navigationInProgress.current = true;
              navigate("/dashboard");
              
              // Réinitialiser le drapeau après un délai
              if (redirectTimeoutRef.current) {
                clearTimeout(redirectTimeoutRef.current);
              }
              redirectTimeoutRef.current = window.setTimeout(() => {
                navigationInProgress.current = false;
              }, 300);
            }
          }
        } else if (event === "USER_UPDATED") {
          // Gérer la mise à jour du profil utilisateur
          console.log("Profil utilisateur mis à jour");
          
          // Vérifier s'il s'agit d'une confirmation de changement d'email
          if (session?.user?.email) {
            console.log("Email mis à jour:", session.user.email);
            
            // Forcer un nettoyage complet du cache
            console.log("Forcer la réinitialisation du cache React Query pour la mise à jour utilisateur");
            queryClient.clear();
            
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
              
              // Rediriger vers les paramètres utilisateur - avec protection contre les redirections multiples
              if (!navigationInProgress.current) {
                navigationInProgress.current = true;
                
                if (redirectTimeoutRef.current) {
                  clearTimeout(redirectTimeoutRef.current);
                }
                redirectTimeoutRef.current = window.setTimeout(() => {
                  navigate("/user-settings");
                  
                  // Réinitialiser le drapeau après navigation
                  redirectTimeoutRef.current = window.setTimeout(() => {
                    navigationInProgress.current = false;
                  }, 300);
                }, 500);
              }
            }
          }
        } else if (event === "SIGNED_OUT") {
          try {
            // Éviter la navigation multiple
            if (navigationInProgress.current) return;
            navigationInProgress.current = true;
            
            // Forcer un nettoyage complet du cache
            console.log("Forcer la réinitialisation du cache React Query pour la déconnexion");
            queryClient.clear();
            
            // MODIFICATION: Au lieu d'utiliser navigate, forcer un rechargement complet
            // Cela résout le problème des liens qui ne fonctionnent plus
            window.location.href = "/";
            
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
      
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }
    };
  }, [queryClient, navigate, location.pathname, location.hash, location.search]);

  return {
    isInitialMount,
  };
};
