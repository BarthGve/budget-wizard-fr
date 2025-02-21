
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SavingsGoal } from "@/components/savings/SavingsGoal";
import { NewSavingDialog } from "@/components/savings/NewSavingDialog";
import { SavingsList } from "@/components/savings/SavingsList";
import { SavingsPieChart } from "@/components/dashboard/SavingsPieChart";
import { useDashboardData } from "@/hooks/useDashboardData";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { SavingsProjectWizard } from "@/components/savings/ProjectWizard/SavingsProjectWizard";

const Savings = () => {
  const { monthlySavings, profile, refetch } = useDashboardData();
  const [showProjectWizard, setShowProjectWizard] = useState(false);

  const totalMonthlyAmount = monthlySavings?.reduce(
    (acc, saving) => acc + saving.amount,
    0
  ) || 0;

  const handleSavingAdded = () => {
    refetch();
  };

  const handleSavingDeleted = () => {
    refetch();
  };

  const handleProjectCreated = () => {
    refetch();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-fade-in">
              Épargne
            </h1>
            <p className="text-muted-foreground">
              Prévoyez vos versements mensuels d'épargne
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setShowProjectWizard(true)}
              variant="outline"
              className="gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              Nouveau projet
            </Button>
            <NewSavingDialog onSavingAdded={handleSavingAdded} />
          </div>
        </div>

        <div className="grid gap-4 grid-cols-12">
          <div className="col-span-8">
            <SavingsGoal
              savingsPercentage={profile?.savings_goal_percentage || 0}
              totalMonthlyAmount={totalMonthlyAmount}
            />
          </div>
          <div className="col-span-4">
            <SavingsPieChart
              monthlySavings={monthlySavings || []}
              totalSavings={totalMonthlyAmount}
            />
          </div>
        </div>

        <div>
          <SavingsList
            monthlySavings={monthlySavings || []}
            onSavingDeleted={handleSavingDeleted}
          />
        </div>

        <Dialog open={showProjectWizard} onOpenChange={setShowProjectWizard}>
          <DialogContent className="max-w-4xl">
            <SavingsProjectWizard 
              onClose={() => setShowProjectWizard(false)}
              onProjectCreated={handleProjectCreated}
            />
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Savings;
