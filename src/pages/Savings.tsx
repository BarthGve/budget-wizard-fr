
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { NewSavingDialog } from "@/components/savings/NewSavingDialog";
import { SavingsProjectWizard } from "@/components/savings/ProjectWizard/SavingsProjectWizard";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { X } from "lucide-react";
import { usePagePermissions } from "@/hooks/usePagePermissions";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SavingsHeader } from "@/components/savings/SavingsHeader";
import { SavingsGoalSection } from "@/components/savings/SavingsGoalSection";
import { ProjectsSection } from "@/components/savings/ProjectsSection";
import { MonthlySavingsSection } from "@/components/savings/MonthlySavingsSection";
import { ProModalDialog } from "@/components/savings/ProModalDialog";

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

  if (showProjectWizard) {
    return <div className="fixed inset-0 flex items-center justify-center bg-background/80 z-50">
        <div className="w-full max-w-4xl relative">
          <Button variant="ghost" size="icon" className="absolute right-2 top-2 z-10" onClick={() => setShowProjectWizard(false)}>
            <X className="h-4 w-4" />
          </Button>
          <SavingsProjectWizard onClose={() => setShowProjectWizard(false)} onProjectCreated={handleProjectCreated} />
        </div>
      </div>;
  }

  return (
    <DashboardLayout>
      <motion.div 
        className="space-y-6 h-[calc(100vh-4rem)] overflow-hidden flex flex-col"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header Section */}
        <SavingsHeader onNewProjectClick={handleNewProjectClick} />

        {/* Savings Goal Section */}
        <SavingsGoalSection 
          profile={profile} 
          totalMonthlyAmount={totalMonthlyAmount}
          monthlySavings={monthlySavings} 
        />

        {/* Projects Section - only show if user has pro access */}
        {canAccessFeature('/savings', 'new_project') && (
          <ProjectsSection 
            projects={projects} 
            onProjectDeleted={handleProjectDeleted}
          />
        )}

        {/* Monthly Savings Section */}
        <MonthlySavingsSection 
          monthlySavings={monthlySavings}
          onSavingDeleted={handleSavingDeleted}
          onSavingAdded={handleSavingAdded}
        />
        
        {/* Pro Feature Modal */}
        <ProModalDialog open={showProModal} onOpenChange={setShowProModal} />
      </motion.div>
    </DashboardLayout>
  );
};

export default Savings;
