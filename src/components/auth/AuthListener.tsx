
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface AuthListenerProps {
  children: React.ReactNode;
}

export const AuthListener = ({ children }: AuthListenerProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Écouteur d'événements d'authentification
    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      console.info("Événement d'authentification détecté:", event);

      // En cas de réinitialisation de mot de passe, rediriger vers la page dédiée
      if (event === "PASSWORD_RECOVERY") {
        navigate('/reset-password');
      }
    });

    // Nettoyage de l'écouteur à la destruction du composant
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  return <>{children}</>;
};
