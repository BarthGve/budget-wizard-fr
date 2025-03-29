
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
  const lastNavigationTime = useRef<number>(0);
  const throttleDelay = 1000; // 1 seconde entre chaque navigation
  const isFirstVisit = useRef(sessionStorage.getItem('visited') !== 'true');
  const authCheckInProgress = useRef(false);

  // Utiliser location.state pour détecter si nous sommes dans une navigation SPA
  const isSpaNavigation = location.state && location.state.isSpaNavigation;
  const noReload = location.state && location.state.noReload;

  // Marquer que nous sommes dans une SPA
  useEffect(() => {
    // Définir une indication explicite que la navigation SPA est active
    sessionStorage.setItem('spa_active', 'true');
    
    // Nettoyer le timeout existant si le composant est démonté
    return () => {
      if (scheduledNavigationTimeout.current) {
        clearTimeout(scheduledNavigationTimeout.current);
      }
    };
  }, []);

  // Vérifier si l'utilisateur est déjà authentifié au démarrage
  useEffect(() => {
    // Pour éviter les vérifications multiples
    if (authCheckInProgress.current) return;
    authCheckInProgress.current = true;

    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          // Si l'utilisateur est authentifié, on l'indique dans la session
          sessionStorage.setItem('authenticated', 'true');
          console.log("Utilisateur déjà authentifié");
        }
      } catch (error) {
        console.error("Erreur lors de la vérification initiale d'authentification:", error);
      } finally {
        authCheckInProgress.current = false;
      }
    };
    
    checkAuth();
  }, []);

  useEffect(() => {
    // Ignorer la vérification lors du premier rendu si c'est une navigation SPA
    // et que nous arrivons d'une autre page
    if (isSpaNavigation && noReload) {
      initialCheckDone.current = true;
      console.log("Navigation SPA détectée, vérification d'authentification ignorée");
      return;
    }
    
    // Éviter les vérifications multiples ou pendant la navigation
    if (isCheckingRef.current || navigationInProgress.current) return;
    
    const checkAuthAndIncome = async () => {
      try {
        isCheckingRef.current = true;
        
        // Vérifier les revenus uniquement si nécessaire et si ce n'est pas la vérification initiale
        if (initialCheckDone.current) {
          await checkOwnerContributorIncome();
        }
        
        // Pour la première visite, utiliser une vérification différée
        if (isFirstVisit.current) {
          isFirstVisit.current = false;
          console.log("Première visite détectée, vérification d'authentification différée");
          initialCheckDone.current = true;
          isCheckingRef.current = false;
          return;
        }
        
        // Si nous sommes déjà authentifiés selon sessionStorage, pas besoin de vérifier à nouveau
        if (sessionStorage.getItem('authenticated') === 'true' && 
            !location.pathname.includes('/login') && 
            !location.pathname.includes('/register')) {
          console.log("Utilisateur déjà connu comme authentifié");
          initialCheckDone.current = true;
          isCheckingRef.current = false;
          return;
        }
        
        // Vérifier l'état d'authentification
        const { data: { user } } = await supabase.auth.getUser();
        
        // Si l'utilisateur est authentifié, le marquer dans sessionStorage
        if (user) {
          sessionStorage.setItem('authenticated', 'true');
        } else {
          sessionStorage.removeItem('authenticated');
        }
        
        // Définir les pages publiques pour éviter la duplication
        const publicPages = [
          "/login",
          "/register",
          "/reset-password",
          "/email-verification",
          "/changelog",
          "/forgot-password",
          "/"
        ];
        
        // Si l'utilisateur n'est pas authentifié et n'est pas sur une page publique
        if (!user && !publicPages.some(path => location.pathname.includes(path) || location.pathname === path)) {
          
          // Éviter les redirections multiples et limiter la fréquence des navigations
          if (!navigationInProgress.current && Date.now() - lastNavigationTime.current > throttleDelay) {
            navigationInProgress.current = true;
            lastNavigationTime.current = Date.now();
            
            console.log("Redirection vers /login via SPA - utilisateur non authentifié");
            
            // Annuler toute navigation programmée précédemment
            if (scheduledNavigationTimeout.current) {
              clearTimeout(scheduledNavigationTimeout.current);
            }
            
            // Utiliser une seule navigation programmée
            scheduledNavigationTimeout.current = window.setTimeout(() => {
              // Utiliser replace: true pour éviter d'ajouter à l'historique
              navigate("/login", { 
                replace: true,
                state: { 
                  from: location.pathname,
                  isSpaNavigation: true,
                  timestamp: Date.now(), // Ajouter un timestamp pour garantir l'unicité
                  noReload: true // Indiquer explicitement de ne pas recharger
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
      
      // Mettre à jour l'état d'authentification en session
      if (event === 'SIGNED_IN' && session) {
        sessionStorage.setItem('authenticated', 'true');
      } else if (event === 'SIGNED_OUT') {
        sessionStorage.removeItem('authenticated');
      }
      
      if (event === 'SIGNED_OUT') {
        // Éviter les redirections multiples et limiter la fréquence des navigations
        if (!navigationInProgress.current && Date.now() - lastNavigationTime.current > throttleDelay) {
          navigationInProgress.current = true;
          lastNavigationTime.current = Date.now();
          
          // Annuler toute navigation programmée précédemment
          if (scheduledNavigationTimeout.current) {
            clearTimeout(scheduledNavigationTimeout.current);
          }
          
          // Stocker l'information de déconnexion en session storage
          sessionStorage.setItem('just_signed_out', 'true');
          
          // Utiliser setTimeout pour éviter les problèmes de navigation
          scheduledNavigationTimeout.current = window.setTimeout(() => {
            navigate("/login", { 
              replace: true,
              state: { 
                isSpaNavigation: true,
                timestamp: Date.now(),
                noReload: true
              } 
            });
            
            // Réinitialiser après un court délai
            scheduledNavigationTimeout.current = window.setTimeout(() => {
              navigationInProgress.current = false;
            }, 500);
          }, 0);
        }
      } else if (event === 'SIGNED_IN') {
        // Rediriger vers le dashboard en mode SPA après connexion
        if (!navigationInProgress.current && Date.now() - lastNavigationTime.current > throttleDelay) {
          navigationInProgress.current = true;
          lastNavigationTime.current = Date.now();
          
          // Annuler toute navigation programmée précédemment
          if (scheduledNavigationTimeout.current) {
            clearTimeout(scheduledNavigationTimeout.current);
          }
          
          scheduledNavigationTimeout.current = window.setTimeout(() => {
            // Garantir que c'est bien une navigation SPA
            navigate("/dashboard", { 
              replace: true,
              state: { 
                isSpaNavigation: true,
                timestamp: Date.now(),
                noReload: true
              } 
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
  }, [location.pathname, navigate, checkOwnerContributorIncome, isSpaNavigation, noReload]);

  return null;
};
