
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { processAuthAction } from "@/utils/authActions";
import { useAuthContext } from "@/context/AuthProvider";

/**
 * Composant qui gère les redirections et actions d'authentification
 * Remplace AuthListener.tsx et useAuthStateListener.ts
 */
export const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuthContext();
  
  // Traiter les actions d'authentification dans l'URL une seule fois au chargement
  useEffect(() => {
    processAuthAction();
  }, []);
  
  // Configuration de Supabase pour la persistance des sessions
  useEffect(() => {
    // S'assurer que la configuration de persistance de session est correcte
    const setupSupabasePersistence = async () => {
      try {
        // Configurer la persistance de session automatiquement
        // Cette étape est optionnelle car normalement la configuration est faite
        // lors de la création du client Supabase, mais cela garantit la cohérence
        await supabase.auth.getSession();
      } catch (error) {
        console.error("Erreur lors de la configuration de la persistance:", error);
      }
    };
    
    setupSupabasePersistence();
  }, []);
  
  // Pas besoin de rendu supplémentaire, ce composant gère juste la logique
  return <>{children}</>;
};

export default AuthWrapper;
