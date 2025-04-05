
import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";

/**
 * Hook qui gère les changements d'état d'authentification
 * et met à jour le cache React Query en conséquence
 */
export const AuthListener = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const isInitialMount = useRef(true);
  const previousAuthState = useRef<boolean | null>(null);
  const navigationInProgress = useRef(false);
  const redirectTimeoutRef = useRef<number | null>(null);
  
  // Stocker l'information de navigation SPA
  useEffect(() => {
    // Marquer l'URL actuelle dans sessionStorage pour identifier les navigations SPA
    sessionStorage.setItem('current_path', location.pathname);
  }, [location.pathname]);

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
          // Mettre à jour le drapeau d'authentification dans sessionStorage
          sessionStorage.setItem('is_authenticated', 'true');
          
          // Vérifier si l'utilisateur vient de vérifier son email
          const justVerified = localStorage.getItem("justVerified") === "true";
          
          // Invalidation de TOUS les caches liés à l'utilisateur
          queryClient.invalidateQueries({ queryKey: ["auth"] });
          queryClient.invalidateQueries({ queryKey: ["current-user"] });
          queryClient.invalidateQueries({ queryKey: ["profile"] });
          queryClient.invalidateQueries({ queryKey: ["isAdmin"] });
          
          // Si l'utilisateur est déjà sur la page de login et vient juste de vérifier son email,
          // on le redirige vers le dashboard
          if (location.pathname === "/login" && justVerified) {
            localStorage.removeItem("justVerified");
            
            // Éviter les redirections multiples
            if (!navigationInProgress.current) {
              navigationInProgress.current = true;
              
              // Utiliser navigate au lieu de window.location pour SPA
              navigate("/dashboard", { replace: true });
              
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
            
            // Invalider TOUTES les requêtes pour rafraîchir les données
            queryClient.invalidateQueries({ queryKey: ["auth"] });
            queryClient.invalidateQueries({ queryKey: ["current-user"] });
            queryClient.invalidateQueries({ queryKey: ["profile"] });
            queryClient.invalidateQueries({ queryKey: ["isAdmin"] });
            
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
                  // Utiliser navigate au lieu de window.location pour SPA
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
          // Effacer le drapeau d'authentification dans sessionStorage
          sessionStorage.removeItem('is_authenticated');
          
          try {
            // Éviter la navigation multiple
            if (navigationInProgress.current) return;
            navigationInProgress.current = true;
            
            // Invalidation de TOUS les caches
            const keysToInvalidate = [
              "auth", 
              "current-user", 
              "profile", 
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
            
            // Utiliser navigate avec replace pour éviter d'ajouter à l'historique
            // et garantir le comportement SPA
            navigate("/", { replace: true });
            
            // Réinitialiser le drapeau après un délai pour permettre la navigation complète
            if (redirectTimeoutRef.current) {
              clearTimeout(redirectTimeoutRef.current);
            }
            redirectTimeoutRef.current = window.setTimeout(() => {
              navigationInProgress.current = false;
            }, 300);
            
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

  return null;
};
