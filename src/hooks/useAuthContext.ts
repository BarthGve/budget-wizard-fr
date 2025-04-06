
import { useContext } from "react";
import { AuthContext } from "@/context/AuthProvider";

/**
 * Hook pour accéder au contexte d'authentification de manière centralisée
 * Simplifie l'accès aux données d'authentification dans toute l'application
 */
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    console.error("useAuthContext appelé en dehors d'un AuthProvider");
    // Retourner une valeur par défaut pour éviter les erreurs
    return {
      user: null,
      session: null,
      loading: false,
      isAuthenticated: false,
      login: async () => null,
      register: async () => null,
      logout: async () => {},
      resetPassword: async () => false,
      updatePassword: async () => false
    };
  }
  
  return context;
};
