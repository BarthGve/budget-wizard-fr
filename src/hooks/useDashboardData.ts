
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useEffect, useRef } from "react";

export const useDashboardData = () => {
  const queryClient = useQueryClient();
  const channelRef = useRef(null);
  const monthlySavingsChannelRef = useRef(null);
  const projectsChannelRef = useRef(null);

  // Set up real-time listener for contributor changes with improved channel management
  useEffect(() => {
    // Cleanup previous channel if it exists
    if (channelRef.current) {
      console.log('Removing existing contributors channel in useDashboardData');
      supabase.removeChannel(channelRef.current);
    }
    
    // Create a new channel with a unique ID
    const channelId = `dashboard-data-${Date.now()}`;
    console.log(`Setting up contributors channel: ${channelId}`);
    
    const channel = supabase
      .channel(channelId)
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'contributors'
        },
        (payload) => {
          console.log('Contributors table changed from useDashboardData hook:', payload);
          // Selectively invalidate only the necessary queries
          queryClient.invalidateQueries({ queryKey: ["dashboard-data"] });
        }
      )
      .subscribe((status) => {
        console.log(`Contributors channel status: ${status}`);
      });
    
    // Store the channel reference
    channelRef.current = channel;

    // Cleanup function
    return () => {
      if (channelRef.current) {
        console.log('Cleaning up contributors channel in useDashboardData unmount');
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [queryClient]);

  // Set up real-time listener for monthly savings changes
  useEffect(() => {
    if (monthlySavingsChannelRef.current) {
      console.log('Removing existing monthly savings channel in useDashboardData');
      supabase.removeChannel(monthlySavingsChannelRef.current);
    }
    
    const channelId = `monthly-savings-changes-${Date.now()}`;
    console.log(`Setting up monthly savings channel: ${channelId}`);
    
    const channel = supabase
      .channel(channelId)
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'monthly_savings'
        },
        (payload) => {
          console.log('Monthly savings table changed:', payload);
          // Invalidate both dashboard data and savings projects
          queryClient.invalidateQueries({ queryKey: ["dashboard-data"] });
          queryClient.invalidateQueries({ queryKey: ["savings-projects"] });
        }
      )
      .subscribe((status) => {
        console.log(`Monthly savings channel status: ${status}`);
      });
    
    monthlySavingsChannelRef.current = channel;

    return () => {
      if (monthlySavingsChannelRef.current) {
        console.log('Cleaning up monthly savings channel in useDashboardData unmount');
        supabase.removeChannel(monthlySavingsChannelRef.current);
        monthlySavingsChannelRef.current = null;
      }
    };
  }, [queryClient]);

  // Set up real-time listener for projects changes
  useEffect(() => {
    if (projectsChannelRef.current) {
      console.log('Removing existing projects channel in useDashboardData');
      supabase.removeChannel(projectsChannelRef.current);
    }
    
    const channelId = `projects-changes-${Date.now()}`;
    console.log(`Setting up projects channel: ${channelId}`);
    
    const channel = supabase
      .channel(channelId)
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'projets_epargne'
        },
        (payload) => {
          console.log('Projects table changed:', payload);
          // Invalidate both dashboard data and savings projects
          queryClient.invalidateQueries({ queryKey: ["dashboard-data"] });
          queryClient.invalidateQueries({ queryKey: ["savings-projects"] });
        }
      )
      .subscribe((status) => {
        console.log(`Projects channel status: ${status}`);
      });
    
    projectsChannelRef.current = channel;

    return () => {
      if (projectsChannelRef.current) {
        console.log('Cleaning up projects channel in useDashboardData unmount');
        supabase.removeChannel(projectsChannelRef.current);
        projectsChannelRef.current = null;
      }
    };
  }, [queryClient]);

  // Utilisation d'une clé partagée pour le user
  const { data: currentUser } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      if (!user) throw new Error("Non authentifié");
      return user;
    },
    staleTime: 1000 * 60 * 5, // Cache de 5 minutes pour l'utilisateur
  });

  // Optimisation des requêtes avec staleTime et regroupement des données
  const { data: dashboardData, refetch: refetchDashboard } = useQuery({
    queryKey: ["dashboard-data", currentUser?.id],
    queryFn: async () => {
      if (!currentUser?.id) throw new Error("User ID requis");

      // Requêtes parallèles pour optimiser le chargement
      const [
        { data: contributors, error: contributorsError },
        { data: monthlySavings, error: savingsError },
        { data: profile, error: profileError },
        { data: recurringExpenses, error: expensesError }
      ] = await Promise.all([
        supabase
          .from("contributors")
          .select("*")
          .eq("profile_id", currentUser.id)
          .order("created_at"),
        supabase
          .from("monthly_savings")
          .select("*")
          .eq("profile_id", currentUser.id)
          .order("created_at"),
        supabase
          .from("profiles")
          .select("*")
          .eq("id", currentUser.id)
          .single(),
        supabase
          .from("recurring_expenses")
          .select("*")
          .eq("profile_id", currentUser.id)
          .order("created_at")
      ]);

      // Gestion centralisée des erreurs
      if (contributorsError) {
        console.error("Error fetching contributors:", contributorsError);
        toast.error("Erreur lors du chargement des contributeurs");
        throw contributorsError;
      }
      if (savingsError) {
        console.error("Error fetching monthly savings:", savingsError);
        toast.error("Erreur lors du chargement de l'épargne mensuelle");
        throw savingsError;
      }
      if (profileError) {
        console.error("Error fetching profile:", profileError);
        toast.error("Erreur lors du chargement du profil");
        throw profileError;
      }
      if (expensesError) {
        console.error("Error fetching recurring expenses:", expensesError);
        toast.error("Erreur lors du chargement des charges récurrentes");
        throw expensesError;
      }

      return {
        contributors: contributors || [],
        monthlySavings: monthlySavings || [],
        profile,
        recurringExpenses: recurringExpenses || []
      };
    },
    enabled: !!currentUser?.id,
    staleTime: 1000 * 30, // Réduire le cache à 30 secondes pour être plus réactif
    retry: 1 // Limite les tentatives de reconnexion
  });

  const refetch = () => {
    refetchDashboard();
  };

  return {
    contributors: dashboardData?.contributors || [],
    monthlySavings: dashboardData?.monthlySavings || [],
    profile: dashboardData?.profile,
    recurringExpenses: dashboardData?.recurringExpenses || [],
    refetch,
  };
};
