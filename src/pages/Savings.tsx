
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SavingsGoal } from "@/components/savings/SavingsGoal";
import { NewSavingDialog } from "@/components/savings/NewSavingDialog";
import { SavingsList } from "@/components/savings/SavingsList";
import { SavingsPieChart } from "@/components/dashboard/SavingsPieChart";
import { useDashboardData } from "@/hooks/useDashboardData";

const Savings = () => {
  const { monthlySavings, profile, refetch } = useDashboardData();

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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-fade-in">Épargne</h1>
            <p className="text-muted-foreground">
              Prévoyez vos versements mensuels d'épargne
            </p>
          </div>
          <NewSavingDialog onSavingAdded={handleSavingAdded} />
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
      </div>
    </DashboardLayout>
  );
};

export default Savings;
