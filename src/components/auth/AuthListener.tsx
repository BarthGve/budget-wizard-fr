
import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useIncomeVerification } from "@/hooks/useIncomeVerification";
import { supabase } from "@/integrations/supabase/client";

export const AuthListener = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showOnboardingDialog, setShowOnboardingDialog, checkOwnerContributorIncome } = useIncomeVerification();
  const isCheckingRef = useRef(false);

  useEffect(() => {
    // Éviter les vérifications multiples
    if (isCheckingRef.current) return;
    
    const checkAuthAndIncome = async () => {
      try {
        isCheckingRef.current = true;
        
        // Vérifier les revenus uniquement si nécessaire
        await checkOwnerContributorIncome();
        
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
          navigate("/login");
        }
      } finally {
        // Reset flag after check completes
        isCheckingRef.current = false;
      }
    };
    
    // Exécuter la vérification
    checkAuthAndIncome();
    
    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        navigate("/login");
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [location.pathname, navigate, checkOwnerContributorIncome]);

  return null;
};
