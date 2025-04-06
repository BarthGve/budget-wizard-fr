
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LoginCredentials, RegisterCredentials } from "@/services/auth";
import { User, Session } from '@supabase/supabase-js';
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

/**
 * Hook principal pour gérer l'authentification
 * Fournit les méthodes de login, logout, etc. et maintient l'état de session
 */
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  // Initialisation et écoute des changements d'état d'authentification
  useEffect(() => {
    console.log("Initialisation de l'authentification...");

    // 1. Configuration de l'écouteur d'abord
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log("Événement d'authentification:", event);
        setSession(newSession);
        setUser(newSession?.user || null);
        setLoading(false);
      }
    );

    // 2. Vérification de la session existante
    const initializeAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
        setUser(data.session?.user || null);
      } catch (error) {
        console.error("Erreur lors de la récupération de la session:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fonction de connexion
  const login = async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        console.error("Erreur de connexion:", error.message);
        toast.error("Échec de connexion: " + error.message);
        throw error;
      }

      console.log("Connexion réussie:", data.user?.email);
      toast.success("Connexion réussie");
      return data;
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Fonction d'inscription
  const register = async (credentials: RegisterCredentials) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            full_name: credentials.full_name,
          },
        },
      });

      if (error) {
        console.error("Erreur d'inscription:", error.message);
        toast.error("Échec d'inscription: " + error.message);
        throw error;
      }

      console.log("Inscription réussie:", data);
      
      if (data.user && !data.session) {
        toast.success("Vérifiez votre email pour confirmer votre inscription");
      } else {
        toast.success("Inscription réussie");
      }
      
      return data;
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Fonction de déconnexion avec nettoyage du cache
  const logout = useCallback(async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      
      // Vider le cache pour éviter les problèmes de données persistantes
      queryClient.clear();
      
      toast.success("Déconnexion réussie");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      toast.error("Erreur lors de la déconnexion");
    } finally {
      setLoading(false);
    }
  }, [queryClient]);

  // Fonction de réinitialisation de mot de passe
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + "/reset-password",
      });

      if (error) {
        toast.error("Erreur d'envoi: " + error.message);
        return false;
      }

      toast.success("Email de réinitialisation envoyé");
      return true;
    } catch (error) {
      console.error("Erreur lors de la réinitialisation du mot de passe:", error);
      return false;
    }
  };

  // Fonction de mise à jour du mot de passe
  const updatePassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        toast.error("Erreur de mise à jour: " + error.message);
        return false;
      }

      toast.success("Mot de passe mis à jour avec succès");
      return true;
    } catch (error) {
      console.error("Erreur lors de la mise à jour du mot de passe:", error);
      return false;
    }
  };

  return {
    user,
    session,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    resetPassword,
    updatePassword,
  };
};
