import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SavingsGoal } from "@/components/savings/SavingsGoal";
import { NewSavingDialog } from "@/components/savings/NewSavingDialog";
import { SavingsList } from "@/components/savings/SavingsList";
import { SavingsPieChart } from "@/components/dashboard/SavingsPieChart";
import { useDashboardData } from "@/hooks/useDashboardData";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { SavingsProjectWizard } from "@/components/savings/ProjectWizard/SavingsProjectWizard";
import { SavingsProjectList } from "@/components/savings/SavingsProjectList";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ChevronDown, ChevronUp, Rocket, X } from "lucide-react";
import { usePagePermissions } from "@/hooks/usePagePermissions";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const Savings = () => {
  const {
    monthlySavings,
    profile,
    refetch
  } = useDashboardData();
  const [showProjectWizard, setShowProjectWizard] = useState(false);
  const [showProModal, setShowProModal] = useState(false);
  const [showProjects, setShowProjects] = useState(true);
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

  const toggleProjectsVisibility = () => {
    setShowProjects(prev => !prev);
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

  return <DashboardLayout>
      <div className="space-y-6 h-[calc(100vh-4rem)] overflow-hidden flex flex-col">
        <div className="flex-none">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-fade-in">
                Épargne
              </h1>
              <p className="text-muted-foreground">
                Prévoyez vos versements mensuels d'épargne
              </p>
            </div>
            <NewSavingDialog onSavingAdded={handleSavingAdded} />
          </div>

          <div className="grid gap-4 grid-cols-12 mt-6">
            <div className="col-span-8">
              <SavingsGoal savingsPercentage={profile?.savings_goal_percentage || 0} totalMonthlyAmount={totalMonthlyAmount} />
            </div>
            <div className="col-span-4">
              <SavingsPieChart monthlySavings={monthlySavings || []} totalSavings={totalMonthlyAmount} />
            </div>
          </div>

          {canAccessFeature('/savings', 'new_project') && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h2 className="font-bold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-fade-in text-2xl">Projets</h2>
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ scale: 1.1 }}
                  >
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={toggleProjectsVisibility}
                      className={cn(
                        "transition-all duration-300 rounded-full hover:bg-primary/10", 
                        showProjects ? "bg-primary/5" : ""
                      )}
                    >
                      {showProjects ? 
                        <ChevronUp className="h-4 w-4 transition-all duration-300 transform" /> : 
                        <ChevronDown className="h-4 w-4 transition-all duration-300 transform" />
                      }
                    </Button>
                  </motion.div>
                </div>
                <Button onClick={handleNewProjectClick} className="gap-2">
                  <Rocket className="h-4 w-4" />
                  Créer
                </Button>
              </div>
              
              <SavingsProjectList projects={projects} onProjectDeleted={handleProjectDeleted} showProjects={showProjects} />
            </div>
          )}
        </div>

        <div className="flex-none mt-6">
          <SavingsList monthlySavings={monthlySavings || []} onSavingDeleted={handleSavingDeleted} />
        </div>
      </div>

      <Dialog open={showProModal} onOpenChange={setShowProModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Fonctionnalité Pro</DialogTitle>
            <DialogDescription>
              La création de projets d'épargne est une fonctionnalité réservée aux utilisateurs Pro. 
              Passez à la version Pro pour accéder à cette fonctionnalité et à bien d'autres avantages.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </DashboardLayout>;
};

export default Savings;
