
import { useContext } from "react";
import { AuthContext } from "@/context/AuthProvider";

/**
 * Hook pour accéder au contexte d'authentification de manière centralisée
 * Simplifie l'accès aux données d'authentification dans toute l'application
 */
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error("useAuthContext doit être utilisé dans un AuthProvider");
  }
  
  return context;
};
