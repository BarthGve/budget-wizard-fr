
import { useQuery, useQueries, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useCallback } from "react";

export const useDashboardData = () => {
  const queryClient = useQueryClient();

  // First, fetch the current user
  const { data: currentUser, error: userError } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      if (!user) throw new Error("Non authentifié");
      return user;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });

  // Optimized error handling
  const handleError = useCallback((error: any, message: string) => {
    console.error(`Error ${message}:`, error);
    toast.error(`Erreur lors du chargement ${message}`);
    throw error;
  }, []);

  // Only fetch dependent data if we have a current user
  const queries = useQueries({
    queries: currentUser ? [
      {
        queryKey: ["contributors", currentUser.id],
        queryFn: async () => {
          const { data, error } = await supabase
            .from("contributors")
            .select("*")
            .eq("profile_id", currentUser.id)
            .order("created_at", { ascending: true });
          if (error) throw error;
          return data || [];
        },
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
      },
      {
        queryKey: ["monthly-savings", currentUser.id],
        queryFn: async () => {
          const { data, error } = await supabase
            .from("monthly_savings")
            .select("*")
            .eq("profile_id", currentUser.id)
            .order("created_at", { ascending: true });
          if (error) throw error;
          return data || [];
        },
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
      },
      {
        queryKey: ["profile", currentUser.id],
        queryFn: async () => {
          const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", currentUser.id)
            .maybeSingle();
          if (error) throw error;
          return data;
        },
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
      },
      {
        queryKey: ["recurring-expenses", currentUser.id],
        queryFn: async () => {
          const { data, error } = await supabase
            .from("recurring_expenses")
            .select("*")
            .eq("profile_id", currentUser.id)
            .order("created_at", { ascending: true });
          if (error) throw error;
          return data || [];
        },
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
      }
    ] : [],
  });

  // Handle authentication error
  if (userError) {
    handleError(userError, "de l'authentification");
    return {
      contributors: [],
      monthlySavings: [],
      profile: null,
      recurringExpenses: [],
      refetch: () => {},
    };
  }

  // Only process queries if we have a current user
  if (currentUser && queries.length > 0) {
    const [contributorsQuery, savingsQuery, profileQuery, expensesQuery] = queries;

    // Handle any errors in the queries
    queries.forEach(query => {
      if (query.error) {
        handleError(query.error, "des données du tableau de bord");
      }
    });

    const refetch = useCallback(() => {
      queryClient.invalidateQueries({ queryKey: ["contributors", currentUser.id] });
      queryClient.invalidateQueries({ queryKey: ["monthly-savings", currentUser.id] });
      queryClient.invalidateQueries({ queryKey: ["profile", currentUser.id] });
      queryClient.invalidateQueries({ queryKey: ["recurring-expenses", currentUser.id] });
    }, [queryClient, currentUser.id]);

    return {
      contributors: contributorsQuery.data || [],
      monthlySavings: savingsQuery.data || [],
      profile: profileQuery.data,
      recurringExpenses: expensesQuery.data || [],
      refetch,
    };
  }

  // Return empty data if no user is authenticated
  return {
    contributors: [],
    monthlySavings: [],
    profile: null,
    recurringExpenses: [],
    refetch: () => {},
  };
};
