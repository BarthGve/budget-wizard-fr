
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useIncomeVerification } from "@/hooks/useIncomeVerification";
import { supabase } from "@/integrations/supabase/client";

export const AuthListener = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showOnboardingDialog, setShowOnboardingDialog, checkOwnerContributorIncome } = useIncomeVerification();

  useEffect(() => {
    checkOwnerContributorIncome();
    
    // Vérifier l'état d'authentification
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Si l'utilisateur n'est pas authentifié et n'est pas sur une page publique
      if (!user && 
          !location.pathname.includes("/login") && 
          !location.pathname.includes("/register") && 
          !location.pathname.includes("/reset-password") && 
          !location.pathname.includes("/email-verification") && 
          location.pathname !== "/") {
        navigate("/login");
      }
    };
    
    checkAuth();
    
    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        navigate("/login");
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [location, navigate, checkOwnerContributorIncome]);

  return null;
};
