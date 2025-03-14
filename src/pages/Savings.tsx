
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { NewSavingDialog } from "@/components/savings/NewSavingDialog";
import { SavingsProjectWizard } from "@/components/savings/ProjectWizard/SavingsProjectWizard";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useState, useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { usePagePermissions } from "@/hooks/usePagePermissions";
import { motion } from "framer-motion";
import { SavingsHeader } from "@/components/savings/SavingsHeader";
import { SavingsGoalSection } from "@/components/savings/SavingsGoalSection";
import { ProjectsSection } from "@/components/savings/ProjectsSection";
import { MonthlySavingsSection } from "@/components/savings/MonthlySavingsSection";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const Savings = () => {
  const {
    monthlySavings,
    profile,
    refetch
  } = useDashboardData();
  const queryClient = useQueryClient();
  const [showProjectWizard, setShowProjectWizard] = useState(false);
  const savingsChannelRef = useRef(null);

  // Écouteurs en temps réel spécifiques à la page Savings
  useEffect(() => {
    // Nettoyer le canal existant
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
  }, [queryClient]);

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
    staleTime: 1000 * 10 // Réduire à 10 secondes pour des mises à jour plus fréquentes
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
    setShowProjectWizard(false);
  };

  const handleProjectDeleted = () => {
    console.log('Project deleted, refreshing data...');
    refetch();
    refetchProjects();
  };

  // Animation variants
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
    <DashboardLayout>
      <motion.div 
        className="space-y-4 mt-4 overflow-hidden flex flex-col"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header Section */}
        <SavingsHeader />

        {/* Savings Goal Section */}
        <SavingsGoalSection 
          profile={profile} 
          totalMonthlyAmount={totalMonthlyAmount}
          monthlySavings={monthlySavings} 
        />
        
        {/* Réorganisation: MonthlySavings en premier, puis Projects */}
        {/* Monthly Savings Section - Pleine largeur */}
        <div className="w-full overflow-y-auto pb-6">
          <MonthlySavingsSection 
            monthlySavings={monthlySavings}
            onSavingDeleted={handleSavingDeleted}
            onSavingAdded={handleSavingAdded}
          />
        </div>
        
        {/* Projects Section - Pleine largeur */}
        <div className="w-full overflow-y-auto pb-6">
          <ProjectsSection 
            projects={projects} 
            onProjectDeleted={handleProjectDeleted}
            onNewProjectClick={() => setShowProjectWizard(true)}
          />
        </div>
        
        {/* Project Wizard Dialog */}
        <Dialog open={showProjectWizard} onOpenChange={setShowProjectWizard}>
          <DialogContent className="max-w-4xl">
            <SavingsProjectWizard 
              onClose={() => setShowProjectWizard(false)} 
              onProjectCreated={handleProjectCreated} 
            />
          </DialogContent>
        </Dialog>
      </motion.div>
    </DashboardLayout>
  );
};

export default Savings;
