
/**
 * Optimisations pour réduire les appels répétitifs à l'API d'authentification
 */

import { supabase } from "@/integrations/supabase/client";

// Cache pour l'utilisateur courant
let userCache: { user: any | null; timestamp: number } | null = null;
const CACHE_DURATION = 30000; // 30 secondes

/**
 * Récupérer l'utilisateur avec mise en cache
 */
export const getCachedUser = async () => {
  const now = Date.now();
  
  // Vérifier si le cache est encore valide
  if (userCache && (now - userCache.timestamp) < CACHE_DURATION) {
    return userCache.user;
  }
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error("Erreur lors de la récupération de l'utilisateur:", error);
      return null;
    }
    
    // Mettre à jour le cache
    userCache = {
      user,
      timestamp: now
    };
    
    return user;
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur:", error);
    return null;
  }
};

/**
 * Invalider le cache utilisateur
 */
export const invalidateUserCache = () => {
  userCache = null;
};

/**
 * Écouter les changements d'authentification pour invalider le cache
 */
export const setupAuthListener = () => {
  return supabase.auth.onAuthStateChange((event, session) => {
    console.log("Changement d'état d'authentification:", event);
    
    // Invalider le cache lors des changements d'authentification
    if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
      invalidateUserCache();
    }
  });
};
