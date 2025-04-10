
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
  const loggingOutRef = useRef(false);
  
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

  // Fonction pour vérifier si l'utilisateur est administrateur
  const checkIfUserIsAdmin = useCallback(async (userId: string): Promise<boolean> => {
    try {
      console.log("Vérification du statut administrateur pour:", userId);
      
      const { data, error } = await supabase.rpc('has_role', {
        user_id: userId,
        role: 'admin'
      });

      if (error) {
        console.error("Erreur lors de la vérification du statut admin:", error);
        return false;
      }
      
      console.log("Résultat de la vérification admin:", data);
      return !!data;
    } catch (error) {
      console.error("Exception lors de la vérification du statut admin:", error);
      return false;
    }
  }, []);

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
      
      // Vérifier si l'utilisateur est administrateur avant de rediriger
      const userId = response.user.id;
      const isAdmin = await checkIfUserIsAdmin(userId);
      
      // Activer un timer de sécurité pour déverrouiller en cas de blocage
      if (loaderSafetyTimeoutRef.current) {
        clearTimeout(loaderSafetyTimeoutRef.current);
      }
      
      loaderSafetyTimeoutRef.current = window.setTimeout(() => {
        console.log("Timer de sécurité activé - Forcer la fin du chargement");
        setLoading(false);
        
        // Forcer la navigation si nécessaire, en tenant compte du statut admin
        if (location.pathname === "/login") {
          const redirectTo = isAdmin ? "/admin" : (location.state?.from?.pathname || "/dashboard");
          console.log("Redirection de secours vers:", redirectTo, "Admin:", isAdmin);
          navigate(redirectTo, { replace: true });
        }
      }, 3000); // Réduit à 3 secondes pour une expérience plus fluide
      
      // Rediriger en fonction du statut admin
      if (location.pathname === "/login") {
        const redirectTo = isAdmin ? "/admin" : (location.state?.from?.pathname || "/dashboard");
        console.log("Redirection après connexion vers:", redirectTo, "Admin:", isAdmin);
        
        // Petit délai pour permettre à l'état d'être mis à jour
        setTimeout(() => {
          navigate(redirectTo, { replace: true });
        }, 100);
      }
      
      return response;
    } catch (error: any) {
      console.error("Erreur de connexion:", error);
      toast.error(error.message || "Erreur de connexion");
      setLoading(false);
      throw error;
    }
  }, [location, navigate, checkIfUserIsAdmin]);

  // Fonction de déconnexion améliorée
  const logout = useCallback(async () => {
    try {
      // Vérifier si on est déjà en train de se déconnecter pour éviter les appels multiples
      if (loggingOutRef.current) {
        console.log("Déconnexion déjà en cours, ignore l'appel");
        return;
      }
      
      // Marquer que la déconnexion est en cours
      loggingOutRef.current = true;
      setLoading(true);
      console.log("Déconnexion en cours...");
      
      // Éviter les navigations multiples
      if (navigationInProgress.current) return;
      navigationInProgress.current = true;
      
      // Réinitialiser l'état local AVANT d'appeler signOut pour éviter
      // les conflits avec les écouteurs d'événements
      console.log("Réinitialisation de l'état local avant signOut");
      setUser(null);
      setSession(null);
      
      // Nettoyer le cache AVANT la déconnexion pour éviter les conflits
      console.log("Nettoyage du cache avant déconnexion");
      try {
        // Méthode plus robuste pour vider le cache
        await queryClient.cancelQueries();
        queryClient.clear();
      } catch (e) {
        console.error("Erreur lors du nettoyage du cache:", e);
      }
      
      // Déconnexion dans Supabase avec attente explicite
      console.log("Appel à supabase.auth.signOut()");
      const { error } = await supabase.auth.signOut({
        scope: 'global' // Déconnexion complète sur tous les appareils
      });
      
      if (error) {
        console.error("Erreur lors de la déconnexion Supabase:", error);
        throw error;
      }
      
      // Ajouter un délai pour s'assurer que tout est bien nettoyé
      console.log("Déconnexion réussie, préparation de la redirection...");
      
      // Vider explicitement le localStorage des tokens Supabase
      try {
        localStorage.removeItem('supabase.auth.token');
        localStorage.removeItem('sb-ndgyijggnmslzosfprpi-auth-token');
      } catch (e) {
        console.error("Erreur lors du nettoyage du localStorage:", e);
      }
      
      toast.success("Déconnexion réussie");
      
      // Rediriger vers la page d'accueil avec replace: true
      console.log("Redirection vers la page d'accueil");
      
      // Utiliser une promesse pour garantir un délai minimum
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Assurer que la redirection se fait bien
      try {
        navigate("/", { replace: true });
      } catch (e) {
        console.error("Erreur lors de la redirection:", e);
        // Fallback en cas d'erreur de navigation
        window.location.href = "/";
      }
      
      // Réinitialiser les drapeaux après un délai
      setTimeout(() => {
        navigationInProgress.current = false;
        loggingOutRef.current = false;
        setLoading(false);
        console.log("Processus de déconnexion terminé");
      }, 300);
      
    } catch (error: any) {
      console.error("Erreur détaillée lors de la déconnexion:", error);
      toast.error("Erreur lors de la déconnexion");
      // En cas d'erreur, réinitialiser quand même les drapeaux
      setLoading(false);
      navigationInProgress.current = false;
      loggingOutRef.current = false;
      
      // Fallback de sécurité en cas d'erreur persistante
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
    }
  }, [navigate, queryClient]);

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

  // Écouteur unique pour les changements d'état d'authentification amélioré
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
          console.log("Événement SIGNED_IN détecté");
          
          // Réduire les invalidations de cache
          setTimeout(() => {
            invalidateAuthCache();
            setLoading(false);
          }, 100);
          
          // Vérifier si l'utilisateur est administrateur avant de rediriger
          if (newSession?.user && location.pathname === "/login" && !navigationInProgress.current) {
            navigationInProgress.current = true;
            
            try {
              // Vérifier le statut d'administrateur
              const isAdmin = await checkIfUserIsAdmin(newSession.user.id);
              
              // Rediriger en fonction du statut admin
              const redirectTo = isAdmin 
                ? "/admin" 
                : (location.state?.from?.pathname || "/dashboard");
              
              console.log("Redirection après SIGNED_IN vers:", redirectTo, "Admin:", isAdmin);
              
              // Différer la navigation pour éviter les conflits
              setTimeout(() => {
                navigate(redirectTo, { replace: true });
                
                setTimeout(() => {
                  navigationInProgress.current = false;
                }, 300);
              }, 200);
            } catch (error) {
              console.error("Erreur lors de la vérification admin:", error);
              // Par défaut, aller au dashboard en cas d'erreur
              setTimeout(() => {
                const from = location.state?.from?.pathname || "/dashboard";
                navigate(from, { replace: true });
                navigationInProgress.current = false;
              }, 200);
            }
          } else {
            setLoading(false);
          }
        } else if (event === "SIGNED_OUT") {
          console.log("Événement SIGNED_OUT détecté");
          
          // S'assurer que toutes les données sont nettoyées lors d'une déconnexion
          queryClient.clear();
          
          // Réinitialiser l'état local immédiatement
          setUser(null);
          setSession(null);
          setLoading(false);
          
          // Si on n'est pas déjà en train de naviguer et qu'on n'est pas sur la page d'accueil
          if (!navigationInProgress.current && location.pathname !== "/") {
            navigationInProgress.current = true;
            
            // Rediriger vers la page d'accueil
            setTimeout(() => {
              console.log("Redirection automatique vers / après SIGNED_OUT");
              navigate("/", { replace: true });
              
              setTimeout(() => {
                navigationInProgress.current = false;
              }, 300);
            }, 100);
          }
        } else {
          setLoading(false);
        }
      }
    );

    // Récupérer la session initiale seulement si pas déjà initialisé
    if (!authInitialized.current) {
      authInitialized.current = true;
      
      supabase.auth.getSession().then(async ({ data }) => {
        console.log("Session initiale:", data.session ? "présente" : "absente");
        
        if (data.session) {
          setSession(data.session);
          setUser(data.session.user || null);
          
          // Vérifier si l'utilisateur est administrateur lors du chargement initial
          // et rediriger si nécessaire (uniquement si sur dashboard ou racine)
          if (data.session.user && (location.pathname === "/" || location.pathname === "/dashboard")) {
            try {
              const isAdmin = await checkIfUserIsAdmin(data.session.user.id);
              if (isAdmin && !navigationInProgress.current) {
                console.log("Admin détecté lors du chargement initial - Redirection vers /admin");
                navigationInProgress.current = true;
                
                // Petit délai pour éviter les conflits
                setTimeout(() => {
                  navigate("/admin", { replace: true });
                  setTimeout(() => {
                    navigationInProgress.current = false;
                  }, 300);
                }, 200);
              }
            } catch (error) {
              console.error("Erreur lors de la vérification admin initiale:", error);
            }
          }
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
  }, [navigate, location.pathname, location.state, invalidateAuthCache, loading, initialized, queryClient, checkIfUserIsAdmin]);

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
