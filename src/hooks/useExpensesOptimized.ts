
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "./useCurrentUser";
import { useState, useMemo } from "react";

interface UseExpensesOptimizedOptions {
  pageSize?: number;
  includeRetailers?: boolean;
}

/**
 * Hook optimisé pour les dépenses avec pagination et cache intelligent
 */
export const useExpensesOptimized = (options: UseExpensesOptimizedOptions = {}) => {
  const { pageSize = 20, includeRetailers = true } = options;
  const { currentUser } = useCurrentUser();
  const [currentPage, setCurrentPage] = useState(0);

  // Requête principale avec pagination et jointures optimisées
  const { data, isLoading, error } = useQuery({
    queryKey: ["expenses-optimized", currentUser?.id, currentPage, pageSize, includeRetailers],
    queryFn: async () => {
      if (!currentUser?.id) throw new Error("Utilisateur non authentifié");

      const from = currentPage * pageSize;
      const to = from + pageSize - 1;

      console.log(`🔍 Chargement des dépenses page ${currentPage + 1}`);

      // Construction de la requête avec jointure conditionnelle
      let query = supabase
        .from("expenses")
        .select(
          includeRetailers 
            ? `
              *,
              retailers (
                id,
                name,
                logo_url
              )
            `
            : "*",
          { count: 'exact' }
        )
        .eq("profile_id", currentUser.id)
        .order("date", { ascending: false })
        .range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        expenses: data || [],
        totalCount: count || 0,
        hasNextPage: (count || 0) > to + 1,
        hasPreviousPage: currentPage > 0,
        currentPage,
        totalPages: Math.ceil((count || 0) / pageSize)
      };
    },
    enabled: !!currentUser?.id,
    staleTime: 1000 * 60, // 1 minute
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false
  });

  // Statistiques mémorisées
  const stats = useMemo(() => {
    if (!data?.expenses) return null;

    const total = data.expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const average = data.expenses.length > 0 ? total / data.expenses.length : 0;

    return {
      total,
      average,
      count: data.expenses.length
    };
  }, [data?.expenses]);

  // Navigation optimisée
  const nextPage = () => {
    if (data?.hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const previousPage = () => {
    if (data?.hasPreviousPage) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const goToPage = (page: number) => {
    if (page >= 0 && page < (data?.totalPages || 0)) {
      setCurrentPage(page);
    }
  };

  const resetPage = () => {
    setCurrentPage(0);
  };

  return {
    expenses: data?.expenses || [],
    totalCount: data?.totalCount || 0,
    currentPage: data?.currentPage || 0,
    totalPages: data?.totalPages || 0,
    hasNextPage: data?.hasNextPage || false,
    hasPreviousPage: data?.hasPreviousPage || false,
    isLoading,
    error,
    stats,
    nextPage,
    previousPage,
    goToPage,
    resetPage
  };
};
