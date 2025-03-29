
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
        
        // Si l'utilisateur n'est pas authentifié et n'est pas sur une page publique
        if (!user && 
            !location.pathname.includes("/login") && 
            !location.pathname.includes("/register") && 
            !location.pathname.includes("/reset-password") && 
            !location.pathname.includes("/email-verification") && 
            !location.pathname.includes("/changelog") && // Page changelog publique
            location.pathname !== "/") {
          
          // Éviter les redirections multiples
          if (!navigationInProgress.current) {
            navigationInProgress.current = true;
            console.log("Redirection vers /login - utilisateur non authentifié");
            
            // Utiliser setTimeout pour éviter les problèmes de navigation
            setTimeout(() => {
              navigate("/login", { replace: true });
              
              // Réinitialiser après un court délai
              setTimeout(() => {
                navigationInProgress.current = false;
              }, 500);
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
          
          // Utiliser setTimeout pour éviter les problèmes de navigation
          setTimeout(() => {
            navigate("/login", { replace: true });
            
            // Réinitialiser après un court délai
            setTimeout(() => {
              navigationInProgress.current = false;
            }, 500);
          }, 0);
        }
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [location.pathname, navigate, checkOwnerContributorIncome]);

  return null;
};
