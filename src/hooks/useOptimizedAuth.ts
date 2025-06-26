
import { useState, useEffect } from "react";
import { getCachedUser, setupAuthListener } from "@/utils/authOptimization";
import { User } from '@supabase/supabase-js';

/**
 * Hook optimisé pour l'authentification avec mise en cache
 * Réduit les appels répétitifs à l'API Supabase
 */
export const useOptimizedAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadUser = async () => {
      try {
        setLoading(true);
        const currentUser = await getCachedUser();
        
        if (mounted) {
          setUser(currentUser);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          console.error("Erreur lors du chargement de l'utilisateur:", err);
          setError("Erreur lors du chargement de l'utilisateur");
          setUser(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Charger l'utilisateur initial
    loadUser();

    // Configurer l'écoute des changements d'authentification
    const { data: { subscription } } = setupAuthListener();

    // Recharger l'utilisateur lors des changements
    const handleAuthChange = () => {
      if (mounted) {
        loadUser();
      }
    };

    // Écouter les changements d'état d'authentification
    subscription && subscription.unsubscribe && subscription.unsubscribe();

    return () => {
      mounted = false;
      subscription && subscription.unsubscribe && subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user
  };
};
