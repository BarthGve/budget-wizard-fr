
import { useUserSession } from "@/hooks/useUserSession";

/**
 * Hook pour récupérer les données utilisateur pour la sidebar
 * Utilise le hook centralisé useUserSession pour une meilleure cohérence
 */
export const useUserData = () => {
  const { currentUser, profile, isAdmin, isLoading, error, refreshUserData } = useUserSession();

  // Afficher des logs de débogage
  if (isLoading) {
    console.log("Chargement des données utilisateur pour la sidebar...");
  }
  
  if (error) {
    console.error("Erreur dans useUserData:", error);
  }
  
  if (!isLoading && !currentUser) {
    console.log("Aucun utilisateur trouvé dans useUserData");
  }

  return {
    currentUser,
    profile,
    isAdmin,
    isLoading,
    refreshUserData
  };
};
