
import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook qui vérifie si un contributeur propriétaire a un revenu nul
 * et gère l'affichage d'une modale d'onboarding en conséquence
 */
export const useIncomeVerification = () => {
  const location = useLocation();
  const [showOnboardingDialog, setShowOnboardingDialog] = useState(false);
  const hasCheckedIncome = useRef(false);

  // Vérifier si le contributeur principal a un revenu nul et si l'onboarding a déjà été complété
  const checkOwnerContributorIncome = async () => {
    // Ne vérifier que si l'utilisateur est sur la page dashboard
    if (location.pathname !== "/dashboard" || hasCheckedIncome.current) return;
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Vérifier d'abord si l'utilisateur est admin
      const { data: isAdmin, error: adminError } = await supabase.rpc('has_role', {
        user_id: user.id,
        role: 'admin'
      });
      
      if (adminError) {
        console.error("Erreur lors de la vérification du rôle admin:", adminError);
      }
      
      // Ne pas afficher la modale pour les admins
      if (isAdmin) {
        hasCheckedIncome.current = true;
        return;
      }

      // Vérifier si l'onboarding a déjà été complété
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("onboarding_completed")
        .eq("id", user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error("Erreur lors de la vérification du profil:", profileError);
      }

      // Si l'utilisateur a déjà complété l'onboarding, ne pas afficher la modale
      if (profileData?.onboarding_completed) {
        hasCheckedIncome.current = true;
        return;
      }

      // Vérifier si l'utilisateur a des revenus configurés
      const { data: ownerContributor, error } = await supabase
        .from("contributors")
        .select("total_contribution")
        .eq("profile_id", user.id)
        .eq("is_owner", true)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error("Erreur lors de la vérification des revenus:", error);
        return;
      }

      // Afficher l'onboarding si l'utilisateur n'a pas de revenus configurés ou si le revenu est à 0
      if (!ownerContributor || ownerContributor.total_contribution === 0) {
        setShowOnboardingDialog(true);
      }
      
      hasCheckedIncome.current = true;
    } catch (error) {
      console.error("Erreur lors de la vérification des revenus:", error);
    }
  };

  // Réinitialiser le flag de vérification des revenus lorsque la route change
  useEffect(() => {
    // Si l'utilisateur navigue vers le dashboard, on vérifie le revenu
    if (location.pathname === "/dashboard") {
      hasCheckedIncome.current = false;
      checkOwnerContributorIncome();
    } else {
      // Si l'utilisateur n'est pas sur le dashboard, on masque la modale
      setShowOnboardingDialog(false);
    }
  }, [location.pathname]);

  return {
    showOnboardingDialog,
    setShowOnboardingDialog,
    checkOwnerContributorIncome,
    hasCheckedIncome
  };
};
