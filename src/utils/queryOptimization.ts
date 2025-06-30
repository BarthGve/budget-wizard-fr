
/**
 * Utilitaires pour l'optimisation des requêtes React Query
 */

// Configuration des temps de cache par type de donnée
export const CACHE_TIMES = {
  // Données statiques (peu de changements)
  STATIC: {
    staleTime: 1000 * 60 * 60 * 24, // 24 heures
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 jours
  },
  
  // Données de référence utilisateur (changements occasionnels)
  REFERENCE: {
    staleTime: 1000 * 60 * 30, // 30 minutes
    gcTime: 1000 * 60 * 60 * 2, // 2 heures
  },
  
  // Données du dashboard (changements fréquents)
  DASHBOARD: {
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  },
  
  // Données temps réel (changements très fréquents)
  REALTIME: {
    staleTime: 1000 * 30, // 30 secondes
    gcTime: 1000 * 60 * 5, // 5 minutes
  },

  // Données de liste paginées
  PAGINATED: {
    staleTime: 1000 * 60, // 1 minute
    gcTime: 1000 * 60 * 15, // 15 minutes
  }
};

// Options par défaut pour différents types de requêtes
export const getQueryOptions = (type: keyof typeof CACHE_TIMES) => ({
  ...CACHE_TIMES[type],
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  retry: 2
});

// Fonction pour précharger les données critiques
export const prefetchCriticalData = async (queryClient: any, userId: string) => {
  console.log("🚀 Préchargement des données critiques");
  
  // Précharger les données du dashboard en arrière-plan
  queryClient.prefetchQuery({
    queryKey: ["optimized-dashboard", userId],
    staleTime: CACHE_TIMES.DASHBOARD.staleTime
  });
  
  // Précharger les données statiques
  queryClient.prefetchQuery({
    queryKey: ["static-vehicle-expense-types"],
    staleTime: CACHE_TIMES.STATIC.staleTime
  });
};

// Fonction pour nettoyer le cache périodiquement
export const cleanupCache = (queryClient: any) => {
  console.log("🧹 Nettoyage du cache");
  
  // Supprimer les requêtes inactives depuis plus de 30 minutes
  queryClient.getQueryCache().clear();
};
