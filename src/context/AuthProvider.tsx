
import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { User, Session } from '@supabase/supabase-js';
import { LoginCredentials, RegisterCredentials } from "@/services/auth";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<any>;
  register: (credentials: RegisterCredentials) => Promise<any>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<boolean>;
  updatePassword: (password: string) => Promise<boolean>;
}

// Création du contexte avec valeurs par défaut
const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  isAuthenticated: false,
  login: async () => null,
  register: async () => null,
  logout: async () => {},
  resetPassword: async () => false,
  updatePassword: async () => false
});

// Hook pour utiliser le contexte d'authentification
export const useAuthContext = () => useContext(AuthContext);

// Fournisseur du contexte d'authentification
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Utiliser le hook useAuth centralisé
  const auth = useAuth();
  const [initiated, setInitiated] = useState(false);
  
  // Marquer le fournisseur comme initialisé après le premier rendu
  useEffect(() => {
    if (!initiated) {
      console.log("AuthProvider initialisé");
      setInitiated(true);
    }
  }, [initiated]);
  
  // Logs pour le débogage
  useEffect(() => {
    console.log("AuthProvider - État d'authentification:", 
      auth.isAuthenticated ? "authentifié" : "non authentifié", 
      "loading:", auth.loading);
  }, [auth.isAuthenticated, auth.loading]);
  
  // Valeur optimisée pour le contexte
  const authValue = {
    user: auth.user,
    session: auth.session,
    loading: auth.loading,
    isAuthenticated: auth.isAuthenticated,
    login: auth.login,
    register: auth.register,
    logout: auth.logout,
    resetPassword: auth.resetPassword,
    updatePassword: auth.updatePassword
  };
  
  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
