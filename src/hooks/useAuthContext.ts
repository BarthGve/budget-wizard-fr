
import { useContext } from "react";
import AuthProvider from "@/context/AuthProvider";

/**
 * Hook pour accéder au contexte d'authentification de manière centralisée
 * Simplifie l'accès aux données d'authentification dans toute l'application
 */
export const useAuthContext = () => {
  const context = useContext(AuthProvider);
  
  if (!context) {
    throw new Error("useAuthContext doit être utilisé dans un AuthProvider");
  }
  
  return context;
};
