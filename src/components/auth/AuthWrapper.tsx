
import { ReactNode, useEffect } from "react";
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

  // Traiter les actions d'authentification dans l'URL et la vérification d'email
  useEffect(() => {
    processAuthAction();
    handlePostEmailVerification(navigate);
  }, [navigate]);

  return <>{children}</>;
};
