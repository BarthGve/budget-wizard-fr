
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SavingsGoal } from "@/components/savings/SavingsGoal";
import { MonthlyTotal } from "@/components/savings/MonthlyTotal";
import { NewSavingDialog } from "@/components/savings/NewSavingDialog";
import { SavingsList } from "@/components/savings/SavingsList";
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
            <h1 className="text-3xl font-bold tracking-tight">Épargne</h1>
            <p className="text-muted-foreground">
              Prévoyez vos versements mensuels d'épargne
            </p>
          </div>
          <NewSavingDialog onSavingAdded={handleSavingAdded} />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <SavingsGoal
            savingsPercentage={profile?.savings_goal_percentage || 0}
            totalMonthlyAmount={totalMonthlyAmount}
          />

          <MonthlyTotal totalMonthlyAmount={totalMonthlyAmount} />
        </div>

        <SavingsList
          monthlySavings={monthlySavings || []}
          onSavingDeleted={handleSavingDeleted}
        />
      </div>
    </DashboardLayout>
  );
};

export default Savings;
