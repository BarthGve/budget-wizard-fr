
import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useIncomeVerification } from "@/hooks/useIncomeVerification";
import { supabase } from "@/integrations/supabase/client";

export const AuthListener = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showOnboardingDialog, setShowOnboardingDialog, checkOwnerContributorIncome } = useIncomeVerification();
  const isCheckingRef = useRef(false);
  const navigationInProgress = useRef(false);
  const initialCheckDone = useRef(false);
  const scheduledNavigationTimeout = useRef<number | null>(null);

  useEffect(() => {
    // Nettoyer le timeout existant si le composant est démonté
    return () => {
      if (scheduledNavigationTimeout.current) {
        clearTimeout(scheduledNavigationTimeout.current);
      }
    };
  }, []);

  useEffect(() => {
    // Éviter les vérifications multiples ou pendant la navigation
    if (isCheckingRef.current || navigationInProgress.current) return;
    
    const checkAuthAndIncome = async () => {
      try {
        isCheckingRef.current = true;
        
        // Vérifier les revenus uniquement si nécessaire et si ce n'est pas la vérification initiale
        if (initialCheckDone.current) {
          await checkOwnerContributorIncome();
        }
        
        // Vérifier l'état d'authentification
        const { data: { user } } = await supabase.auth.getUser();
        
        // Définir les pages publiques pour éviter la duplication
        const publicPages = [
          "/login",
          "/register",
          "/reset-password",
          "/email-verification",
          "/changelog",
          "/"
        ];
        
        // Si l'utilisateur n'est pas authentifié et n'est pas sur une page publique
        if (!user && !publicPages.some(path => location.pathname.includes(path))) {
          
          // Éviter les redirections multiples
          if (!navigationInProgress.current) {
            navigationInProgress.current = true;
            console.log("Redirection vers /login via SPA - utilisateur non authentifié");
            
            // Annuler toute navigation programmée précédemment
            if (scheduledNavigationTimeout.current) {
              clearTimeout(scheduledNavigationTimeout.current);
            }
            
            // Utiliser navigate avec state pour conserver l'information de SPA
            scheduledNavigationTimeout.current = window.setTimeout(() => {
              // Utiliser replace: true pour éviter d'ajouter à l'historique
              navigate("/login", { 
                replace: true,
                state: { 
                  from: location.pathname,
                  isSpaNavigation: true
                } 
              });
              
              // Réinitialiser le flag après un court délai
              scheduledNavigationTimeout.current = window.setTimeout(() => {
                navigationInProgress.current = false;
              }, 300);
            }, 0);
          }
        }
        
        initialCheckDone.current = true;
      } catch (error) {
        console.error("Erreur lors de la vérification d'authentification:", error);
      } finally {
        // Réinitialiser le flag une fois la vérification terminée
        setTimeout(() => {
          isCheckingRef.current = false;
        }, 300);
      }
    };
    
    // Exécuter la vérification
    checkAuthAndIncome();
    
    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Événement auth détecté:", event);
      
      if (event === 'SIGNED_OUT') {
        // Éviter les redirections multiples
        if (!navigationInProgress.current) {
          navigationInProgress.current = true;
          
          // Annuler toute navigation programmée précédemment
          if (scheduledNavigationTimeout.current) {
            clearTimeout(scheduledNavigationTimeout.current);
          }
          
          // Utiliser setTimeout pour éviter les problèmes de navigation
          scheduledNavigationTimeout.current = window.setTimeout(() => {
            navigate("/login", { 
              replace: true,
              state: { isSpaNavigation: true } 
            });
            
            // Réinitialiser après un court délai
            scheduledNavigationTimeout.current = window.setTimeout(() => {
              navigationInProgress.current = false;
            }, 500);
          }, 0);
        }
      } else if (event === 'SIGNED_IN') {
        // Rediriger vers le dashboard en mode SPA après connexion
        if (!navigationInProgress.current) {
          navigationInProgress.current = true;
          
          // Annuler toute navigation programmée précédemment
          if (scheduledNavigationTimeout.current) {
            clearTimeout(scheduledNavigationTimeout.current);
          }
          
          scheduledNavigationTimeout.current = window.setTimeout(() => {
            navigate("/dashboard", { 
              replace: true,
              state: { isSpaNavigation: true } 
            });
            
            // Réinitialiser après un court délai
            scheduledNavigationTimeout.current = window.setTimeout(() => {
              navigationInProgress.current = false;
            }, 500);
          }, 0);
        }
      }
    });
    
    return () => {
      subscription.unsubscribe();
      if (scheduledNavigationTimeout.current) {
        clearTimeout(scheduledNavigationTimeout.current);
      }
    };
  }, [location.pathname, navigate, checkOwnerContributorIncome]);

  return null;
};
