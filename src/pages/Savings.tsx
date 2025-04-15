import { useState, useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { SavingsHeader } from "@/components/savings/SavingsHeader";
import { SavingsGoalSection } from "@/components/savings/SavingsGoalSection";
import { ProjectsSection } from "@/components/savings/ProjectsSection";
import { MonthlySavingsSection } from "@/components/savings/MonthlySavingsSection";
import { useIsMobile } from "@/hooks/use-mobile";
import { WithTooltipProvider } from "@/components/providers/TooltipProviders";
import { useDashboardData } from "@/hooks/useDashboardData";

const Savings = () => {
  const {
    monthlySavings,
    profile,
    refetch
  } = useDashboardData();
  const queryClient = useQueryClient();
  const savingsChannelRef = useRef(null);
  const [projectRefreshCounter, setProjectRefreshCounter] = useState(0); // Compteur pour forcer le rafraîchissement
  const isMobile = useIsMobile();

  useEffect(() => {
    if (savingsChannelRef.current) {
      console.log('Removing existing savings page channel');
      supabase.removeChannel(savingsChannelRef.current);
    }
    
    const channelId = `savings-page-${Date.now()}`;
    console.log(`Setting up savings page channel: ${channelId}`);
    
    const channel = supabase
      .channel(channelId)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'monthly_savings'
        },
        (payload) => {
          console.log('Monthly savings changed in Savings page:', payload);
          queryClient.invalidateQueries({ queryKey: ["savings-projects"] });
          refetch();
        }
      )
      .subscribe((status) => {
        console.log(`Savings page channel status: ${status}`);
      });
    
    savingsChannelRef.current = channel;
    
    return () => {
      if (savingsChannelRef.current) {
        console.log('Cleaning up savings page channel');
        supabase.removeChannel(savingsChannelRef.current);
        savingsChannelRef.current = null;
      }
    };
  }, [queryClient, refetch]);

  const {
    data: projects = [],
    refetch: refetchProjects
  } = useQuery({
    queryKey: ["savings-projects"],
    queryFn: async () => {
      console.log('Fetching savings projects...');
      const {
        data,
        error
      } = await supabase.from("projets_epargne").select("*").order("created_at", {
        ascending: false
      });
      if (error) {
        console.error("Error fetching savings projects:", error);
        throw error;
      }
      console.log('Fetched projects:', data?.length);
      return data;
    },
    staleTime: 1000 * 10
  });

  const totalMonthlyAmount = monthlySavings?.reduce((acc, saving) => acc + saving.amount, 0) || 0;

  const handleSavingAdded = () => {
    console.log('Saving added, refreshing data...');
    refetch();
    refetchProjects();
  };

  const handleSavingDeleted = () => {
    console.log('Saving deleted, refreshing data...');
    refetch();
    refetchProjects();
  };

  const handleProjectCreated = () => {
    console.log('Project created, refreshing data...');
    refetch();
    refetchProjects();
    setProjectRefreshCounter(prev => prev + 1);
  };

  const handleProjectDeleted = () => {
    console.log('Project deleted, refreshing data...');
    refetch();
    refetchProjects();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  return (
    <WithTooltipProvider>
      <motion.div 
        className="space-y-6 overflow-hidden flex flex-col container px-4 py-6 mx-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <SavingsHeader 
          onSavingAdded={handleSavingAdded}
          onProjectCreated={handleProjectCreated}
        />
        <SavingsGoalSection 
          profile={profile} 
          totalMonthlyAmount={totalMonthlyAmount}
          monthlySavings={monthlySavings} 
        />
        <MonthlySavingsSection 
          monthlySavings={monthlySavings}
          onSavingDeleted={handleSavingDeleted}
          showInitial={!isMobile}
        />
        <ProjectsSection 
          projects={projects} 
          onProjectDeleted={handleProjectDeleted}
          forceRefresh={projectRefreshCounter}
        />
      </motion.div>
    </WithTooltipProvider>
  );
};

export default Savings;
