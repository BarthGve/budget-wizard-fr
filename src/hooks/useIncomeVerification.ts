
import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook qui vérifie si un contributeur propriétaire a un revenu nul
 * et gère l'affichage d'une modale en conséquence
 */
export const useIncomeVerification = () => {
  const location = useLocation();
  const [showIncomeDialog, setShowIncomeDialog] = useState(false);
  const hasCheckedIncome = useRef(false);

  // Vérifier si le contributeur principal a un revenu nul
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

      const { data: ownerContributor, error } = await supabase
        .from("contributors")
        .select("total_contribution")
        .eq("profile_id", user.id)
        .eq("is_owner", true)
        .single();

      if (error) {
        console.error("Erreur lors de la vérification des revenus:", error);
        return;
      }

      if (ownerContributor && ownerContributor.total_contribution === 0) {
        setShowIncomeDialog(true);
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
      setShowIncomeDialog(false);
    }
  }, [location.pathname]);

  return {
    showIncomeDialog,
    setShowIncomeDialog,
    checkOwnerContributorIncome,
    hasCheckedIncome
  };
};
