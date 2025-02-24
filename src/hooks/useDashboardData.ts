
import { useQuery, useQueries, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useCallback } from "react";

export const useDashboardData = () => {
  const queryClient = useQueryClient();

  // Optimized error handling
  const handleError = useCallback((error: any, message: string) => {
    console.error(`Error ${message}:`, error);
    toast.error(`Erreur lors du chargement ${message}`);
    throw error;
  }, []);

  // Use parallel queries for better performance
  const queries = useQueries({
    queries: [
      {
        queryKey: ["current-user"],
        queryFn: async () => {
          const { data: { user }, error } = await supabase.auth.getUser();
          if (error) throw error;
          if (!user) throw new Error("Non authentifié");
          return user;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 30, // 30 minutes
      },
      {
        queryKey: ["contributors"],
        queryFn: async () => {
          const { data: user } = await queryClient.fetchQuery({ queryKey: ["current-user"] });
          const { data, error } = await supabase
            .from("contributors")
            .select("*")
            .eq("profile_id", user.id)
            .order("created_at", { ascending: true });
          if (error) throw error;
          return data || [];
        },
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
      },
      {
        queryKey: ["monthly-savings"],
        queryFn: async () => {
          const { data: user } = await queryClient.fetchQuery({ queryKey: ["current-user"] });
          const { data, error } = await supabase
            .from("monthly_savings")
            .select("*")
            .eq("profile_id", user.id)
            .order("created_at", { ascending: true });
          if (error) throw error;
          return data || [];
        },
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
      },
      {
        queryKey: ["profile"],
        queryFn: async () => {
          const { data: user } = await queryClient.fetchQuery({ queryKey: ["current-user"] });
          const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .maybeSingle();
          if (error) throw error;
          return data;
        },
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
      },
      {
        queryKey: ["recurring-expenses"],
        queryFn: async () => {
          const { data: user } = await queryClient.fetchQuery({ queryKey: ["current-user"] });
          const { data, error } = await supabase
            .from("recurring_expenses")
            .select("*")
            .eq("profile_id", user.id)
            .order("created_at", { ascending: true });
          if (error) throw error;
          return data || [];
        },
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
      }
    ]
  });

  const [userQuery, contributorsQuery, savingsQuery, profileQuery, expensesQuery] = queries;

  // Handle errors
  queries.forEach(query => {
    if (query.error) {
      handleError(query.error, "des données du tableau de bord");
    }
  });

  const refetch = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["current-user"] });
    queryClient.invalidateQueries({ queryKey: ["contributors"] });
    queryClient.invalidateQueries({ queryKey: ["monthly-savings"] });
    queryClient.invalidateQueries({ queryKey: ["profile"] });
    queryClient.invalidateQueries({ queryKey: ["recurring-expenses"] });
  }, [queryClient]);

  return {
    contributors: contributorsQuery.data || [],
    monthlySavings: savingsQuery.data || [],
    profile: profileQuery.data,
    recurringExpenses: expensesQuery.data || [],
    refetch,
  };
};
