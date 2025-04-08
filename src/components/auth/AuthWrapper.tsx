
import { ReactNode, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { processAuthAction } from "@/utils/authActions";
import { handlePostEmailVerification } from "@/utils/emailVerificationActions";
import { useNavigate } from "react-router-dom";

interface AuthWrapperProps {
  children: ReactNode;
}

export const AuthWrapper = ({ children }: AuthWrapperProps) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const processedRef = useRef(false);

  // Traiter les actions d'authentification dans l'URL et la vérification d'email
  // Utiliser une référence pour éviter les appels multiples
  useEffect(() => {
    if (!processedRef.current) {
      console.log("AuthWrapper - Traitement des actions d'authentification");
      processedRef.current = true;
      
      try {
        processAuthAction();
        handlePostEmailVerification(navigate);
      } catch (error) {
        console.error("Erreur lors du traitement des actions d'authentification:", error);
      }
    }
  }, [navigate]);

  return <>{children}</>;
};
