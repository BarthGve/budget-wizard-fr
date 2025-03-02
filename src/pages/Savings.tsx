
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { NewSavingDialog } from "@/components/savings/NewSavingDialog";
import { SavingsProjectWizard } from "@/components/savings/ProjectWizard/SavingsProjectWizard";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { usePagePermissions } from "@/hooks/usePagePermissions";
import { motion } from "framer-motion";
import { SavingsHeader } from "@/components/savings/SavingsHeader";
import { SavingsGoalSection } from "@/components/savings/SavingsGoalSection";
import { ProjectsSection } from "@/components/savings/ProjectsSection";
import { MonthlySavingsSection } from "@/components/savings/MonthlySavingsSection";
import { ProModalDialog } from "@/components/savings/ProModalDialog";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const Savings = () => {
  const {
    monthlySavings,
    profile,
    refetch
  } = useDashboardData();
  const [showProjectWizard, setShowProjectWizard] = useState(false);
  const [showProModal, setShowProModal] = useState(false);
  const {
    canAccessFeature
  } = usePagePermissions();

  const {
    data: projects = [],
    refetch: refetchProjects
  } = useQuery({
    queryKey: ["savings-projects"],
    queryFn: async () => {
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
      return data;
    }
  });

  const totalMonthlyAmount = monthlySavings?.reduce((acc, saving) => acc + saving.amount, 0) || 0;

  const handleSavingAdded = () => {
    refetch();
  };

  const handleSavingDeleted = () => {
    refetch();
  };

  const handleProjectCreated = () => {
    refetch();
    refetchProjects();
    setShowProjectWizard(false);
  };

  const handleProjectDeleted = () => {
    refetch();
    refetchProjects();
  };

  const handleNewProjectClick = () => {
    if (canAccessFeature('/savings', 'new_project')) {
      setShowProjectWizard(true);
    } else {
      setShowProModal(true);
    }
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
        className="space-y-4 h-[calc(100vh-4rem)] overflow-hidden flex flex-col"
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
        
        {/* Main Content - Two Columns */}
        <div className="flex flex-col md:flex-row gap-12 flex-1 overflow-hidden">
          {/* Left Column - Monthly Savings - 1/3 */}
          <div className="md:w-1/3 overflow-y-auto pb-6">
            <MonthlySavingsSection 
              monthlySavings={monthlySavings}
              onSavingDeleted={handleSavingDeleted}
              onSavingAdded={handleSavingAdded}
            />
          </div>
          
          {/* Right Column - Projects - 2/3 */}
          <div className="md:w-2/3 overflow-y-auto pb-6">
            {canAccessFeature('/savings', 'new_project') && (
              <ProjectsSection 
                projects={projects} 
                onProjectDeleted={handleProjectDeleted}
                onNewProjectClick={handleNewProjectClick}
              />
            )}
          </div>
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
        
        {/* Pro Feature Modal */}
        <ProModalDialog open={showProModal} onOpenChange={setShowProModal} />
      </motion.div>
    </DashboardLayout>
  );
};

export default Savings;
