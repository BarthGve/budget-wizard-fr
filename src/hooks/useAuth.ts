import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { LoginCredentials, RegisterCredentials } from "@/services/auth";
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
    queryClient.invalidateQueries({ queryKey: ["profile"] });
    queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    queryClient.invalidateQueries({ queryKey: ["isAdmin"] });
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
      
      // Fournir un retour visuel immédiat
      toast.success("Connexion réussie!");
      
      // Mettre à jour l'état local immédiatement
      setUser(data.user);
      setSession(data.session);
      
      // Activer un timer de sécurité pour déverrouiller en cas de blocage
      if (loaderSafetyTimeoutRef.current) {
        clearTimeout(loaderSafetyTimeoutRef.current);
      }
      
      loaderSafetyTimeoutRef.current = window.setTimeout(() => {
        if (loading) {
          console.log("Timer de sécurité activé - Forcer la fin du chargement");
          setLoading(false);
        }
      }, 8000); // 8 secondes maximum de loader
      
      return data;
    } catch (error: any) {
      toast.error(error.message || "Erreur de connexion");
      throw error;
    }
  }, [loading]);

  // Déconnexion utilisateur optimisée
  const logout = useCallback(async () => {
    try {
      setLoading(true);
      
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
    if (authListenerActive.current) {
      console.log("Écouteur d'authentification déjà actif, éviter la duplication");
      return;
    }
    
    console.log("Initialisation de l'écouteur d'authentification principal");
    authListenerActive.current = true;
    
    // Configurer l'écouteur d'événements d'authentification de manière optimisée
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
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
          console.log("Événement SIGNED_IN détecté - Traitement optimisé");
          
          // Invalider seulement les caches nécessaires
          invalidateAuthCache();
          
          // Autoriser les redirections seulement si elles ne sont pas déjà en cours
          if (!navigationInProgress.current && !authInitialized.current) {
            // Vérifier si l'utilisateur doit être redirigé selon son statut
            if (newSession?.user) {
              try {
                const { data: isAdmin } = await supabase.rpc('has_role', {
                  user_id: newSession.user.id,
                  role: 'admin'
                });
                
                navigationInProgress.current = true;
                
                // Appliquer les redirections avec un délai pour éviter les conflits
                setTimeout(() => {
                  // Redirection conditionnelle selon le statut admin
                  if (isAdmin && (location.pathname === "/login" || location.pathname === "/")) {
                    console.log("Redirection admin vers /admin");
                    navigate("/admin", { replace: true });
                  } else if (location.pathname === "/login") {
                    console.log("Redirection utilisateur vers /dashboard");
                    navigate("/dashboard", { replace: true });
                  }
                  
                  // Réinitialiser le statut de navigation
                  setTimeout(() => {
                    navigationInProgress.current = false;
                    setLoading(false);
                  }, 500);
                }, 100);
              } catch (error) {
                console.error("Erreur lors de la vérification du statut admin:", error);
                setLoading(false);
              }
            }
          } else {
            // Si redirection en cours ou déjà initialisé, juste terminer le chargement
            setLoading(false);
          }
        } else if (event === "USER_UPDATED") {
          console.log("Événement USER_UPDATED détecté");
          
          // Invalider seulement les caches nécessaires
          invalidateAuthCache();
          setLoading(false);
          
          // Traiter les mises à jour d'email
          if (newSession?.user?.email && location.hash.includes("type=email_change")) {
            // Nettoyer l'URL
            if (window.history && window.history.replaceState) {
              window.history.replaceState({}, document.title, window.location.pathname);
            }
            
            // Informer l'utilisateur
            toast.success("Votre adresse email a été mise à jour avec succès");
            
            // Redirection vers les paramètres utilisateur si besoin
            if (!navigationInProgress.current) {
              navigationInProgress.current = true;
              
              // Attendre un peu avant de rediriger pour éviter les collisions
              setTimeout(() => {
                navigate("/user-settings");
                navigationInProgress.current = false;
              }, 500);
            }
          } else {
            setLoading(false);
          }
        } else if (event === "SIGNED_OUT") {
          console.log("Événement SIGNED_OUT détecté");
          
          // Nettoyer l'état et le cache
          invalidateAuthCache();
          setLoading(false);
          
          // Redirection seulement si nécessaire et pas déjà en cours
          if (!navigationInProgress.current && location.pathname !== "/") {
            navigationInProgress.current = true;
            navigate("/", { replace: true });
            
            // Réinitialiser le drapeau après un délai
            setTimeout(() => {
              navigationInProgress.current = false;
            }, 300);
          } else {
            setLoading(false);
          }
        } else {
          // Pour les autres événements, simplement arrêter le chargement
          setLoading(false);
        }
      }
    );

    // Récupérer la session initiale seulement si pas déjà initialisé
    if (!authInitialized.current) {
      supabase.auth.getSession().then(({ data }) => {
        authInitialized.current = true;
        
        if (data.session) {
          console.log("Session initiale trouvée");
          setSession(data.session);
          setUser(data.session.user || null);
        }
        
        // Terminer le chargement initial
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
      
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }
      
      if (loaderSafetyTimeoutRef.current) {
        clearTimeout(loaderSafetyTimeoutRef.current);
      }
    };
  }, [navigate, location.pathname, location.hash, invalidateAuthCache]);

  // Ajouter un timer de sécurité global pour empêcher le blocage indéfini de l'écran de chargement
  useEffect(() => {
    // Si l'écran de chargement persiste plus de 10 secondes, le désactiver
    if (loading) {
      const safetyTimeout = setTimeout(() => {
        console.log("Timer de sécurité global activé - Forcer la fin du chargement");
        setLoading(false);
      }, 10000);
      
      return () => clearTimeout(safetyTimeout);
    }
  }, [loading]);

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
