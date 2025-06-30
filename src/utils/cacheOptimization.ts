
/**
 * Système de cache intelligent avec TTL différenciés
 */

// Configuration des temps de cache par type de donnée
export const CACHE_CONFIG = {
  // Données statiques (rarement modifiées)
  STATIC: {
    staleTime: 1000 * 60 * 60 * 24, // 24 heures
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 jours
  },
  
  // Données de référence utilisateur
  USER_REFERENCE: {
    staleTime: 1000 * 60 * 30, // 30 minutes
    gcTime: 1000 * 60 * 60 * 2, // 2 heures
  },
  
  // Données du dashboard
  DASHBOARD: {
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  },
  
  // Données temps réel
  REALTIME: {
    staleTime: 1000 * 30, // 30 secondes
    gcTime: 1000 * 60 * 5, // 5 minutes
  },

  // Données paginées
  PAGINATED: {
    staleTime: 1000 * 60, // 1 minute
    gcTime: 1000 * 60 * 15, // 15 minutes
  }
};

// Options par défaut pour différents types de requêtes
export const getCacheOptions = (type: keyof typeof CACHE_CONFIG) => ({
  ...CACHE_CONFIG[type],
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  retry: 2
});

// Fonction pour précharger les données critiques
export const prefetchCriticalData = async (queryClient: any, userId: string) => {
  console.log("🚀 Préchargement des données critiques");
  
  // Précharger le dashboard en arrière-plan
  queryClient.prefetchQuery({
    queryKey: ["dashboard-optimized", userId],
    staleTime: CACHE_CONFIG.DASHBOARD.staleTime
  });
  
  // Précharger les données statiques
  queryClient.prefetchQuery({
    queryKey: ["static-vehicle-expense-types"],
    staleTime: CACHE_CONFIG.STATIC.staleTime
  });
};

// Fonction pour nettoyer le cache périodiquement
export const cleanupOldCache = (queryClient: any) => {
  console.log("🧹 Nettoyage du cache ancien");
  
  // Supprimer les requêtes inactives depuis plus de 1 heure
  const queries = queryClient.getQueryCache().getAll();
  const oneHourAgo = Date.now() - (1000 * 60 * 60);
  
  queries.forEach(query => {
    if (query.state.dataUpdatedAt < oneHourAgo && !query.getObserversCount()) {
      queryClient.removeQueries({ queryKey: query.queryKey });
    }
  });
};

// Optimisation des requêtes par batch
export const batchQueries = (queries: any[]) => {
  return Promise.all(queries);
};
