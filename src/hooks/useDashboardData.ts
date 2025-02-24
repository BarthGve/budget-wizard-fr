
import { useQuery, useQueries, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useCallback } from "react";

interface Contributor {
  id: string;
  name: string;
  email: string;
  is_owner: boolean;
  created_at: string;
  percentage_contribution: number;
  total_contribution: number;
  profile_id: string;
}

interface MonthlySaving {
  id: string;
  amount: number;
  name: string;
  description?: string;
  logo_url?: string;
}

interface Profile {
  id: string;
  full_name?: string;
  avatar_url?: string;
  savings_goal_percentage?: number;
}

interface RecurringExpense {
  id: string;
  name: string;
  amount: number;
  category: string;
  periodicity: string;
  debit_day: number;
  debit_month?: number;
}

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

  // Define refetch callback outside conditions
  const refetch = useCallback(() => {
    if (currentUser?.id) {
      queryClient.invalidateQueries({ queryKey: ["contributors", currentUser.id] });
      queryClient.invalidateQueries({ queryKey: ["monthly-savings", currentUser.id] });
      queryClient.invalidateQueries({ queryKey: ["profile", currentUser.id] });
      queryClient.invalidateQueries({ queryKey: ["recurring-expenses", currentUser.id] });
    }
  }, [queryClient, currentUser?.id]);

  // Optimized error handling
  const handleError = useCallback((error: any, message: string) => {
    console.error(`Error ${message}:`, error);
    toast.error(`Erreur lors du chargement ${message}`);
    throw error;
  }, []);

  // Handle authentication error
  if (userError) {
    handleError(userError, "de l'authentification");
    return {
      contributors: [] as Contributor[],
      monthlySavings: [] as MonthlySaving[],
      profile: null as Profile | null,
      recurringExpenses: [] as RecurringExpense[],
      refetch,
    };
  }

  // Only fetch dependent data if we have a current user
  const dependentQueries = useQueries({
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
          return (data || []) as Contributor[];
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
          return (data || []) as MonthlySaving[];
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
          return data as Profile | null;
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
          return (data || []) as RecurringExpense[];
        },
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
      }
    ] : []
  });

  // Handle query errors
  dependentQueries.forEach((query) => {
    if ('error' in query && query.error) {
      handleError(query.error, "des données du tableau de bord");
    }
  });

  // Return data based on queries state
  return {
    contributors: currentUser && dependentQueries[0]?.data ? dependentQueries[0].data : [],
    monthlySavings: currentUser && dependentQueries[1]?.data ? dependentQueries[1].data : [],
    profile: currentUser && dependentQueries[2]?.data ? dependentQueries[2].data : null,
    recurringExpenses: currentUser && dependentQueries[3]?.data ? dependentQueries[3].data : [],
    refetch,
  };
};
