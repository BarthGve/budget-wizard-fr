
import { ZeroIncomeDialog } from "./ZeroIncomeDialog";
import { useZeroIncomeCheck } from "@/hooks/auth/useZeroIncomeCheck";
import { useEmailVerificationHandler } from "@/hooks/auth/useEmailVerificationHandler";
import { useAuthStateChange } from "@/hooks/auth/useAuthStateChange";

/**
 * Composant qui écoute les changements d'état d'authentification
 * et met à jour le cache React Query en conséquence de manière optimisée
 */
export const AuthListener = () => {
  // Utiliser les hooks spécialisés
  const { 
    showIncomeDialog, 
    setShowIncomeDialog,
    checkOwnerContributorIncome,
    resetIncomeCheck 
  } = useZeroIncomeCheck();

  // Gérer les vérifications d'emails
  useEmailVerificationHandler();

  // Gérer les changements d'état d'authentification
  useAuthStateChange({ 
    checkOwnerContributorIncome,
    resetIncomeCheck
  });

  return (
    <ZeroIncomeDialog 
      open={showIncomeDialog} 
      onOpenChange={setShowIncomeDialog} 
    />
  );
};
