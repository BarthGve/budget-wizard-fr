import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { LoginCredentials, RegisterCredentials } from "@/services/auth";
import { User, Session } from "@supabase/supabase-js";

/**
 * Hook central pour gérer l'authentification
 * Combine les fonctionnalités de useAuthStateListener et AuthListener
 */
export function useAuth() {
  // États d'authentification
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [initialized, setInitialized] = useState<boolean>(false);

  // Navigation et cache
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Références pour éviter les comportements indésirables
  const navigationInProgress = useRef(false);
  const redirectTimeoutRef = useRef<number | null>(null);

  // Fonction pour invalider tous les caches pertinents
  const invalidateAllCaches = useCallback(() => {
    console.log("Réinitialisation complète du cache React Query depuis useAuth");
    queryClient.clear(); // Nettoyage complet du cache
    
    // Forcer l'invalidation des caches spécifiques pour garantir leur actualisation
    const cachesToInvalidate = [
      "auth", 
      "current-user", 
      "profile", 
      "user-profile",
      "profile-avatar",
      "isAdmin",
      "contributors", 
      "expenses", 
      "recurring-expenses",
      "recurring-expense-categories",
      "credits",
      "credits-monthly-stats",
      "savings"
    ];
    
    cachesToInvalidate.forEach(key => {
      queryClient.invalidateQueries({ queryKey: [key] });
    });
  }, [queryClient]);

  // Connexion utilisateur
  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          throw new Error("Email ou mot de passe incorrect");
        } else {
          throw new Error(`Erreur de connexion: ${error.message}`);
        }
      }
      
      if (!data || !data.user) {
        throw new Error("Réponse inattendue du serveur. Veuillez réessayer.");
      }
      
      toast.success("Connexion réussie!");
      
      // Réinitialiser complètement le cache pour forcer un rechargement des données
      invalidateAllCaches();
      
      // Stocker les données dans le état
      setUser(data.user);
      setSession(data.session);
      
      // Rediriger vers le tableau de bord
      navigate("/dashboard");
      
      return data;
    } catch (error: any) {
      toast.error(error.message || "Erreur de connexion");
      throw error;
    } finally {
      setLoading(false);
    }
  }, [navigate, invalidateAllCaches]);

  // Inscription utilisateur
  const register = useCallback(async (credentials: RegisterCredentials) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: { 
            name: credentials.name,
          }
        }
      });

      if (error) {
        if (error.message.includes("User already registered")) {
          throw new Error("Un compte existe déjà avec cet email");
        } else {
          throw error;
        }
      }
      
      if (!data || !data.user) {
        throw new Error("Réponse inattendue du serveur. Veuillez réessayer.");
      }
      
      // Stocker l'email pour la vérification
      localStorage.setItem("verificationEmail", credentials.email);
      
      return data;
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de l'inscription");
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Déconnexion utilisateur
  const logout = useCallback(async () => {
    try {
      setLoading(true);
      
      // Éviter les navigations multiples
      if (navigationInProgress.current) return;
      navigationInProgress.current = true;
      
      // Réinitialiser complètement le cache avant la déconnexion
      invalidateAllCaches();
      
      // Déconnexion dans Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Réinitialiser l'état local
      setUser(null);
      setSession(null);
      
      toast.success("Déconnexion réussie");
      
      // Rediriger vers la page d'accueil
      navigate("/", { replace: true });
      
      // Réinitialiser le drapeau de navigation après un délai
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }
      redirectTimeoutRef.current = window.setTimeout(() => {
        navigationInProgress.current = false;
      }, 300);
      
    } catch (error: any) {
      console.error("Erreur lors de la déconnexion:", error);
      toast.error("Erreur lors de la déconnexion");
    } finally {
      setLoading(false);
    }
  }, [navigate, invalidateAllCaches]);

  // Récupération du mot de passe
  const resetPassword = useCallback(async (email: string) => {
    try {
      setLoading(true);
      const currentUrl = window.location.origin;
      const redirectUrl = `${currentUrl}/reset-password`;
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl
      });

      if (error) throw error;
      
      toast.success("Un email de réinitialisation vous a été envoyé");
      return true;
    } catch (error: any) {
      console.error("Erreur lors de la réinitialisation du mot de passe:", error);
      toast.error("Une erreur s'est produite. Veuillez réessayer plus tard.");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Mise à jour du mot de passe
  const updatePassword = useCallback(async (password: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;
      
      toast.success("Mot de passe mis à jour avec succès");
      return true;
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour du mot de passe:", error);
      toast.error(error.message || "Erreur lors de la mise à jour du mot de passe");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Écouteur pour les changements d'état d'authentification
  useEffect(() => {
    const setupAuthListener = async () => {
      // Configurer l'écouteur d'événements d'authentification
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, newSession) => {
          console.log("Événement d'authentification détecté dans useAuth:", event);
          
          // Mettre à jour l'état de session immédiatement
          setSession(newSession);
          setUser(newSession?.user || null);
          
          // Marquer comme initialisé après le premier événement
          if (!initialized) {
            setInitialized(true);
            setLoading(false);
          }
          
          // Actions spécifiques selon l'événement
          if (event === "SIGNED_IN") {
            // Réinitialiser complètement le cache pour forcer un rechargement des données
            invalidateAllCaches();
            
            // Vérifier si l'utilisateur vient de vérifier son email
            const justVerified = localStorage.getItem("justVerified") === "true";
            if (location.pathname === "/login" && justVerified) {
              localStorage.removeItem("justVerified");
              
              // Éviter les redirections multiples
              if (!navigationInProgress.current) {
                navigationInProgress.current = true;
                navigate("/dashboard");
                
                // Réinitialiser le drapeau après un délai
                if (redirectTimeoutRef.current) {
                  clearTimeout(redirectTimeoutRef.current);
                }
                redirectTimeoutRef.current = window.setTimeout(() => {
                  navigationInProgress.current = false;
                }, 300);
              }
            }
          } else if (event === "USER_UPDATED") {
            // Réinitialiser complètement le cache pour forcer un rechargement des données
            invalidateAllCaches();
            
            // Gérer la confirmation de changement d'email
            if (newSession?.user?.email) {
              // Vérifier si le changement provient d'un lien de changement d'email
              if (location.hash.includes("type=email_change") || 
                  location.search.includes("type=emailChange") ||
                  localStorage.getItem("verificationEmail")) {
                  
                // Nettoyer l'URL et le localStorage
                if (window.history && window.history.replaceState) {
                  window.history.replaceState({}, document.title, window.location.pathname);
                }
                localStorage.removeItem("verificationEmail");
                
                // Informer l'utilisateur
                toast.success("Votre adresse email a été mise à jour avec succès");
                
                // Rediriger vers les paramètres utilisateur
                if (!navigationInProgress.current) {
                  navigationInProgress.current = true;
                  
                  if (redirectTimeoutRef.current) {
                    clearTimeout(redirectTimeoutRef.current);
                  }
                  redirectTimeoutRef.current = window.setTimeout(() => {
                    navigate("/user-settings");
                    
                    // Réinitialiser le drapeau après navigation
                    setTimeout(() => {
                      navigationInProgress.current = false;
                    }, 300);
                  }, 500);
                }
              }
            }
          } else if (event === "SIGNED_OUT") {
            // Réinitialiser complètement le cache
            invalidateAllCaches();
            
            // Éviter les redirections multiples
            if (!navigationInProgress.current && location.pathname !== "/") {
              navigationInProgress.current = true;
              navigate("/", { replace: true });
              
              // Réinitialiser le drapeau après un délai
              if (redirectTimeoutRef.current) {
                clearTimeout(redirectTimeoutRef.current);
              }
              redirectTimeoutRef.current = window.setTimeout(() => {
                navigationInProgress.current = false;
              }, 300);
            }
          }
        }
      );

      // Récupérer la session initiale
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setSession(data.session);
        setUser(data.session.user || null);
      }
      
      // Marquer comme chargé et initialisé après la vérification initiale
      setLoading(false);
      setInitialized(true);

      // Nettoyage lors du démontage
      return () => {
        if (subscription) {
          subscription.unsubscribe();
        }
        
        if (redirectTimeoutRef.current) {
          clearTimeout(redirectTimeoutRef.current);
        }
      };
    };
    
    setupAuthListener();
  }, [navigate, location.pathname, location.hash, location.search, invalidateAllCaches]);

  // Rafraîchissement automatique du token
  useEffect(() => {
    // Configuration du rafraîchissement périodique du token
    const setupTokenRefresh = () => {
      if (!session) return;
      
      // Calculer quand rafraîchir le token (30 min avant expiration)
      const expiresAt = session.expires_at;
      if (!expiresAt) return;
      
      const expiresAtMs = expiresAt * 1000;
      const refreshAt = expiresAtMs - (30 * 60 * 1000); // 30 minutes avant expiration
      const timeUntilRefresh = refreshAt - Date.now();
      
      if (timeUntilRefresh <= 0) {
        // Rafraîchir immédiatement si le token expire dans moins de 30 minutes
        refreshToken();
        return;
      }
      
      // Programmer le rafraîchissement du token
      const refreshTimer = setTimeout(refreshToken, timeUntilRefresh);
      
      return () => clearTimeout(refreshTimer);
    };
    
    const refreshToken = async () => {
      try {
        console.log("Rafraîchissement automatique du token...");
        const { data, error } = await supabase.auth.refreshSession();
        
        if (error) {
          console.error("Erreur lors du rafraîchissement du token:", error);
          return;
        }
        
        if (data.session) {
          setSession(data.session);
          setUser(data.session.user || null);
          localStorage.setItem('auth_session', JSON.stringify(data.session));
          
          // Programmer le prochain rafraîchissement
          setupTokenRefresh();
        }
      } catch (error) {
        console.error("Erreur lors du rafraîchissement du token:", error);
      }
    };
    
    const cleanup = setupTokenRefresh();
    return cleanup;
  }, [session]);

  return {
    user,
    session,
    loading,
    isAuthenticated: !!session,
    login,
    register,
    logout,
    resetPassword,
    updatePassword
  };
}
