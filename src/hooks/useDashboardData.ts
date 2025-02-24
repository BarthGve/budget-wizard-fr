
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
  
  const { data: currentUser } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Auth error:", error);
        toast.error("Erreur d'authentification");
        throw error;
      }
      return user;
    },
    retry: false
  });

  const { data: contributors = [] } = useQuery<Contributor[]>({
    queryKey: ["contributors", currentUser?.id],
    queryFn: async () => {
      if (!currentUser?.id) return [];
      const { data, error } = await supabase
        .from("contributors")
        .select("*")
        .eq("profile_id", currentUser.id)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data || [];
    },
    enabled: !!currentUser?.id
  });

  const { data: monthlySavings = [] } = useQuery<MonthlySaving[]>({
    queryKey: ["monthly-savings", currentUser?.id],
    queryFn: async () => {
      if (!currentUser?.id) return [];
      const { data, error } = await supabase
        .from("monthly_savings")
        .select("*")
        .eq("profile_id", currentUser.id)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data || [];
    },
    enabled: !!currentUser?.id
  });

  const { data: profile = null } = useQuery<Profile | null>({
    queryKey: ["profile", currentUser?.id],
    queryFn: async () => {
      if (!currentUser?.id) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", currentUser.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!currentUser?.id
  });

  const { data: recurringExpenses = [] } = useQuery<RecurringExpense[]>({
    queryKey: ["recurring-expenses", currentUser?.id],
    queryFn: async () => {
      if (!currentUser?.id) return [];
      const { data, error } = await supabase
        .from("recurring_expenses")
        .select("*")
        .eq("profile_id", currentUser.id)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data || [];
    },
    enabled: !!currentUser?.id
  });

  const refetch = () => {
    if (!currentUser?.id) return;
    
    queryClient.invalidateQueries({
      queryKey: ["contributors", currentUser.id]
    });
    queryClient.invalidateQueries({
      queryKey: ["monthly-savings", currentUser.id]
    });
    queryClient.invalidateQueries({
      queryKey: ["profile", currentUser.id]
    });
    queryClient.invalidateQueries({
      queryKey: ["recurring-expenses", currentUser.id]
    });
  };

  return {
    contributors,
    monthlySavings,
    profile,
    recurringExpenses,
    refetch,
  };
};
