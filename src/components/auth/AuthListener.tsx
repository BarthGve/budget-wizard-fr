
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
            navigate("/login", { replace: true });
            
            // Réinitialiser après un court délai
            setTimeout(() => {
              navigationInProgress.current = false;
            }, 500);
          }
        }
        
        initialCheckDone.current = true;
      } finally {
        // Reset flag after check completes
        isCheckingRef.current = false;
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
          navigate("/login", { replace: true });
          
          // Réinitialiser après un court délai
          setTimeout(() => {
            navigationInProgress.current = false;
          }, 500);
        }
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [location.pathname, navigate, checkOwnerContributorIncome]);

  return null;
};
