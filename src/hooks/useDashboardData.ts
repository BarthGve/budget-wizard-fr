
import { useAuthContext } from "@/hooks/useAuthContext";
import { useDashboardQueries } from "./useDashboardQueries";
import { useRealtimeListeners } from "./useRealtimeListeners";
import { useCallback, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";

/**
 * Hook optimisé pour la récupération des données du tableau de bord
 * Centralise la logique de récupération et de mise à jour des données
 */
export const useDashboardData = () => {
  const { user } = useAuthContext();
  const queryClient = useQueryClient();
  const initialLoadDoneRef = useRef(false);
  
  // Configurer les écouteurs en temps réel
  useRealtimeListeners();
  
  // Récupérer les données du dashboard en fonction de l'utilisateur courant
  const { dashboardData, refetchDashboard, isLoading, error } = useDashboardQueries(user?.id);

  // Effet pour forcer un rechargement initial après le montage
  useEffect(() => {
    if (user?.id && !initialLoadDoneRef.current) {
      console.log("Chargement initial des données du dashboard");
      const timeoutId = setTimeout(() => {
        refetchDashboard();
        initialLoadDoneRef.current = true;
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  }, [user?.id, refetchDashboard]);

  // Effet pour gérer les rechargements en cas d'erreur
  useEffect(() => {
    if (error && user?.id) {
      console.error("Erreur lors du chargement des données du dashboard:", error);
      
      // Attendre un peu avant de réessayer en cas d'erreur
      const retryId = setTimeout(() => {
        console.log("Tentative de rechargement après erreur");
        queryClient.invalidateQueries({ queryKey: ["dashboard-data"] });
      }, 2000);
      
      return () => clearTimeout(retryId);
    }
  }, [error, user?.id, queryClient]);

  // Fonction de rechargement enveloppée dans useCallback pour éviter les recréations
  const refetch = useCallback(() => {
    console.log("Rechargement manuel des données du dashboard");
    return refetchDashboard();
  }, [refetchDashboard]);

  return {
    contributors: dashboardData?.contributors || [],
    monthlySavings: dashboardData?.monthlySavings || [],
    profile: dashboardData?.profile,
    recurringExpenses: dashboardData?.recurringExpenses || [],
    isLoading,
    error,
    refetch,
  };
};
