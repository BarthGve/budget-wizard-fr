import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useDashboardData = () => {
  // Fetch contributors data
  const { data: contributors, refetch: refetchContributors } = useQuery({
    queryKey: ["contributors"],
    queryFn: async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error("Non authentifié");

      const { data, error } = await supabase
        .from("contributors")
        .select("*")
        .eq("profile_id", user.id)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching contributors:", error);
        toast.error("Erreur lors du chargement des contributeurs");
        throw error;
      }

      return data || [];
    },
  });

  // Fetch monthly savings data
  const { data: monthlySavings, refetch: refetchMonthlySavings } = useQuery({
    queryKey: ["monthly-savings"],
    queryFn: async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error("Non authentifié");

      const { data, error } = await supabase
        .from("monthly_savings")
        .select("*")
        .eq("profile_id", user.id)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching monthly savings:", error);
        toast.error("Erreur lors du chargement de l'épargne mensuelle");
        throw error;
      }

      return data || [];
    },
  });

  // Fetch user profile
  const { data: profile, refetch: refetchProfile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error("Non authentifié");

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        toast.error("Erreur lors du chargement du profil");
        throw error;
      }

      return data;
    },
  });

  // Fetch recurring expenses
  const { data: recurringExpenses, refetch: refetchRecurringExpenses } = useQuery({
    queryKey: ["recurring-expenses"],
    queryFn: async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error("Non authentifié");
      
      const { data, error } = await supabase
        .from("recurring_expenses")
        .select("*")
        .eq("profile_id", user.id)
        .eq("periodicity", "monthly")  // Ne sélectionner que les charges mensuelles
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching recurring expenses:", error);
        toast.error("Erreur lors du chargement des charges récurrentes");
        throw error;
      }

      return data;
    },
  });

  const refetch = () => {
    refetchContributors();
    refetchMonthlySavings();
    refetchProfile();
    refetchRecurringExpenses();
  };

  return {
    contributors,
    monthlySavings,
    profile,
    recurringExpenses,
    refetch,
  };
};
