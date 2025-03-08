
import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ZeroIncomeDialog } from "./ZeroIncomeDialog";
import { useAuthStateListener } from "@/hooks/useAuthStateListener";
import { useIncomeVerification } from "@/hooks/useIncomeVerification";
import { processAuthAction, handlePostEmailVerification } from "@/utils/authActions";

/**
 * Composant qui écoute les changements d'état d'authentification
 * et gère les interactions utilisateur en conséquence
 */
export const AuthListener = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isInitialMount } = useAuthStateListener();
  const { showIncomeDialog, setShowIncomeDialog, checkOwnerContributorIncome } = useIncomeVerification();

  // Détecter et gérer les actions de vérification d'email
  useEffect(() => {
    // Appel de la fonction de traitement des actions d'authentification
    processAuthAction();
    
    // Écouter les changements d'URL qui pourraient contenir de nouveaux tokens
    const handleLocationChange = () => {
      processAuthAction();
    };
    
    window.addEventListener("hashchange", handleLocationChange);
    return () => {
      window.removeEventListener("hashchange", handleLocationChange);
    };
  }, [navigate]);

  // Gérer la redirection post-vérification email
  useEffect(() => {
    handlePostEmailVerification(navigate);
  }, [location.pathname, navigate]);

  // Vérifier les revenus après la connexion initiale
  useEffect(() => {
    if (!isInitialMount.current && location.pathname === "/dashboard") {
      setTimeout(() => {
        checkOwnerContributorIncome();
      }, 1000);
    }
  }, [isInitialMount, location.pathname, checkOwnerContributorIncome]);

  return (
    <ZeroIncomeDialog 
      open={showIncomeDialog} 
      onOpenChange={setShowIncomeDialog} 
    />
  );
};
