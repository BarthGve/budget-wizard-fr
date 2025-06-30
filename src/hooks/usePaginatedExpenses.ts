
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "./useCurrentUser";
import { useState } from "react";

/**
 * Hook optimisé pour les dépenses avec pagination
 * Évite de charger toutes les dépenses d'un coup
 */
export const usePaginatedExpenses = (pageSize: number = 20) => {
  const { currentUser } = useCurrentUser();
  const [currentPage, setCurrentPage] = useState(0);

  const { data, isLoading, error } = useQuery({
    queryKey: ["paginated-expenses", currentUser?.id, currentPage, pageSize],
    queryFn: async () => {
      if (!currentUser?.id) throw new Error("Utilisateur non authentifié");

      const from = currentPage * pageSize;
      const to = from + pageSize - 1;

      // Requête avec pagination et jointure optimisée
      const { data, error, count } = await supabase
        .from("expenses")
        .select(`
          *,
          retailers!inner(
            id,
            name,
            logo_url
          )
        `, { count: 'exact' })
        .eq("profile_id", currentUser.id)
        .order("date", { ascending: false })
        .range(from, to);

      if (error) throw error;

      return {
        expenses: data || [],
        totalCount: count || 0,
        hasNextPage: (count || 0) > to + 1,
        hasPreviousPage: currentPage > 0
      };
    },
    enabled: !!currentUser?.id,
    staleTime: 1000 * 60, // 1 minute de cache
    keepPreviousData: true // Garder les données précédentes lors du changement de page
  });

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
    setCurrentPage(page);
  };

  return {
    expenses: data?.expenses || [],
    totalCount: data?.totalCount || 0,
    currentPage,
    hasNextPage: data?.hasNextPage || false,
    hasPreviousPage: data?.hasPreviousPage || false,
    isLoading,
    error,
    nextPage,
    previousPage,
    goToPage,
    pageSize
  };
};
