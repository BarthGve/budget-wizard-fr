import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { LoginCredentials, RegisterCredentials, loginUser } from "@/services/auth";
import { User, Session } from "@supabase/supabase-js";

/**
 * Hook central pour gérer l'authentification
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
  const authListenerActive = useRef(false);
  const authInitialized = useRef(false);
  
  // Timer de sécurité pour éviter les blocages infinis sur le loader
  const loaderSafetyTimeoutRef = useRef<number | null>(null);

  // Fonction optimisée pour invalider les caches nécessaires seulement
  const invalidateAuthCache = useCallback(() => {
    console.log("Invalidation ciblée du cache d'authentification");
    
    // Invalider seulement les caches essentiels liés à l'authentification
    queryClient.invalidateQueries({ queryKey: ["current-user"] });
    
    // Éviter d'invalider trop de caches pour réduire les risques de boucles
    setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      queryClient.invalidateQueries({ queryKey: ["isAdmin"] });
    }, 100);
  }, [queryClient]);

  // Connexion utilisateur
  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      console.log("Tentative de connexion avec:", credentials.email);
      
      // Utiliser la fonction centralisée loginUser pour la cohérence
      const response = await loginUser(credentials);

      // Corriger l'accès aux propriétés en fonction du type de retour actuel
      if (!response || !response.user) {
        setLoading(false);
        throw new Error("Réponse inattendue du serveur. Veuillez réessayer.");
      }
      
      console.log("Connexion réussie pour:", response.user.email);
      
      // Mettre à jour l'état local immédiatement
      setUser(response.user);
      setSession(response.session);
      
      // Activer un timer de sécurité pour déverrouiller en cas de blocage
      if (loaderSafetyTimeoutRef.current) {
        clearTimeout(loaderSafetyTimeoutRef.current);
      }
      
      loaderSafetyTimeoutRef.current = window.setTimeout(() => {
        console.log("Timer de sécurité activé - Forcer la fin du chargement");
        setLoading(false);
        
        // Forcer la navigation si nécessaire
        const from = location.state?.from?.pathname || "/dashboard";
        if (location.pathname === "/login") {
          navigate(from, { replace: true });
        }
      }, 3000); // Réduit à 3 secondes pour une expérience plus fluide
      
      return response;
    } catch (error: any) {
      console.error("Erreur de connexion:", error);
      toast.error(error.message || "Erreur de connexion");
      setLoading(false);
      throw error;
    }
  }, [location, navigate]);

  // Déconnexion utilisateur optimisée
  const logout = useCallback(async () => {
    try {
      setLoading(true);
      console.log("Déconnexion en cours...");
      
      // Éviter les navigations multiples
      if (navigationInProgress.current) return;
      navigationInProgress.current = true;
      
      // Déconnexion dans Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Réinitialiser l'état local immédiatement
      setUser(null);
      setSession(null);
      
      // Nettoyer le cache de manière sélective
      invalidateAuthCache();
      
      toast.success("Déconnexion réussie");
      
      // Rediriger vers la page d'accueil avec replace: true
      navigate("/", { replace: true });
      
      // Réinitialiser le drapeau de navigation après un délai
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }
      redirectTimeoutRef.current = window.setTimeout(() => {
        navigationInProgress.current = false;
        setLoading(false);
      }, 300);
      
    } catch (error: any) {
      console.error("Erreur lors de la déconnexion:", error);
      toast.error("Erreur lors de la déconnexion");
      setLoading(false);
      navigationInProgress.current = false;
    }
  }, [navigate, invalidateAuthCache]);

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

  // Écouteur unique pour les changements d'état d'authentification
  useEffect(() => {
    // Éviter les écouteurs multiples
    if (authListenerActive.current) {
      console.log("Écouteur d'authentification déjà actif, éviter la duplication");
      return;
    }
    
    console.log("Initialisation de l'écouteur d'authentification principal");
    authListenerActive.current = true;
    
    // Sécurité: forcer la fin du chargement après 5 secondes quoi qu'il arrive
    const safetyTimer = setTimeout(() => {
      if (loading) {
        console.log("Fin forcée du chargement après délai de sécurité");
        setLoading(false);
      }
    }, 5000);
    
    // Configurer l'écouteur d'événements d'authentification de manière optimisée
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log("Événement d'authentification détecté:", event, newSession ? "session active" : "pas de session");
        
        // Désactiver le timer de sécurité s'il est en cours
        if (loaderSafetyTimeoutRef.current) {
          clearTimeout(loaderSafetyTimeoutRef.current);
          loaderSafetyTimeoutRef.current = null;
        }
        
        // Mettre à jour l'état de session immédiatement
        setSession(newSession);
        setUser(newSession?.user || null);
        
        // Marquer comme initialisé après le premier événement si ce n'est pas déjà fait
        if (!initialized) {
          setInitialized(true);
          setLoading(false);
        }
        
        // Actions spécifiques selon l'événement
        if (event === "SIGNED_IN") {
          console.log("Événement SIGNED_IN détecté");
          
          // Réduire les invalidations de cache
          setTimeout(() => {
            invalidateAuthCache();
            setLoading(false);
          }, 100);
          
          // Redirection uniquement si on est sur la page de login
          if (location.pathname === "/login" && !navigationInProgress.current) {
            navigationInProgress.current = true;
            const from = location.state?.from?.pathname || "/dashboard";
            
            // Différer la navigation pour éviter les conflits
            setTimeout(() => {
              console.log("Redirection depuis login vers:", from);
              navigate(from, { replace: true });
              
              setTimeout(() => {
                navigationInProgress.current = false;
              }, 300);
            }, 200);
          } else {
            setLoading(false);
          }
        } else if (event === "SIGNED_OUT") {
          console.log("Événement SIGNED_OUT détecté");
          setLoading(false);
        } else {
          setLoading(false);
        }
      }
    );

    // Récupérer la session initiale seulement si pas déjà initialisé
    if (!authInitialized.current) {
      authInitialized.current = true;
      
      supabase.auth.getSession().then(({ data }) => {
        console.log("Session initiale:", data.session ? "présente" : "absente");
        
        if (data.session) {
          setSession(data.session);
          setUser(data.session.user || null);
        }
        
        // Terminer le chargement initial
        setLoading(false);
        setInitialized(true);
      }).catch(err => {
        console.error("Erreur lors de la récupération de la session initiale:", err);
        setLoading(false);
        setInitialized(true);
      });
    }

    // Nettoyage lors du démontage
    return () => {
      if (subscription) {
        subscription.unsubscribe();
        authListenerActive.current = false;
      }
      
      clearTimeout(safetyTimer);
      
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }
      
      if (loaderSafetyTimeoutRef.current) {
        clearTimeout(loaderSafetyTimeoutRef.current);
      }
    };
  }, [navigate, location.pathname, location.state, invalidateAuthCache, loading, initialized]);

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
