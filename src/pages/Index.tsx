
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { BarChart } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { RevenueCard } from "@/components/dashboard/RevenueCard";
import { ExpensesCard } from "@/components/dashboard/ExpensesCard";
import { SavingsCard } from "@/components/dashboard/SavingsCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCategoryColor } from "@/utils/colors";

const Dashboard = () => {
  // Fetch contributors data for total revenue
  const { data: contributors } = useQuery({
    queryKey: ["contributors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contributors")
        .select("*")
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
  const { data: monthlySavings } = useQuery({
    queryKey: ["monthly-savings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("monthly_savings")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching monthly savings:", error);
        toast.error("Erreur lors du chargement de l'épargne mensuelle");
        throw error;
      }

      return data || [];
    },
  });

  // Fetch user profile for savings goal percentage
  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        toast.error("Erreur lors du chargement du profil");
        throw error;
      }

      return data;
    },
  });

  // Calculate total revenue from contributors
  const totalRevenue = contributors?.reduce(
    (sum, contributor) => sum + contributor.total_contribution,
    0
  ) || 0;

  // Calculate cumulative percentages for the stacked progress bar
  const cumulativeContributionPercentages = contributors?.reduce<{ name: string; start: number; end: number; amount: number }[]>(
    (acc, contributor) => {
      const lastEnd = acc.length > 0 ? acc[acc.length - 1].end : 0;
      const percentage = (contributor.total_contribution / totalRevenue) * 100;
      return [
        ...acc,
        {
          name: contributor.name,
          start: lastEnd,
          end: lastEnd + percentage,
          amount: contributor.total_contribution
        }
      ];
    },
    []
  ) || [];

  // Fetch recurring expenses data
  const { data: recurringExpenses } = useQuery({
    queryKey: ["recurring-expenses"],
    queryFn: async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      if (!user) {
        toast.error("Vous devez être connecté pour voir vos charges récurrentes");
        throw new Error("Not authenticated");
      }

      const { data, error } = await supabase
        .from("recurring_expenses")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching recurring expenses:", error);
        toast.error("Erreur lors du chargement des charges récurrentes");
        throw error;
      }

      return data;
    },
  });

  // Calculate total monthly savings
  const totalMonthlySavings = monthlySavings?.reduce(
    (sum, saving) => sum + saving.amount,
    0
  ) || 0;

  // Calculate savings goal based on total revenue and savings percentage
  const savingsGoal = profile?.savings_goal_percentage
    ? (totalRevenue * profile.savings_goal_percentage) / 100
    : 0;

  // Calculate total expenses
  const totalExpenses = recurringExpenses?.reduce((sum, expense) => sum + Number(expense.amount), 0) || 0;

  // Calculate cumulative expense percentages
  const cumulativeExpensePercentages = contributors?.reduce<{ name: string; start: number; end: number; amount: number }[]>(
    (acc, contributor) => {
      const lastEnd = acc.length > 0 ? acc[acc.length - 1].end : 0;
      const contributorShare = totalExpenses * (contributor.percentage_contribution / 100);
      return [
        ...acc,
        {
          name: contributor.name,
          start: lastEnd,
          end: lastEnd + contributor.percentage_contribution,
          amount: contributorShare
        }
      ];
    },
    []
  ) || [];

  return (
    <DashboardLayout>
      <div className="grid gap-6">
        {/* En-tête du dashboard */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Aperçu de votre situation financière
            </p>
          </div>
        </div>

        {/* Cartes principales */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <RevenueCard 
            totalRevenue={totalRevenue}
            contributorShares={cumulativeContributionPercentages}
          />
          <ExpensesCard 
            totalExpenses={totalExpenses}
            contributorShares={cumulativeExpensePercentages}
          />
          <SavingsCard 
            totalMonthlySavings={totalMonthlySavings}
            savingsGoal={savingsGoal}
          />
        </div>

        {/* Répartition des dépenses récurrentes */}
        <Card className="col-span-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle>Répartition des Dépenses Récurrentes</CardTitle>
              <CardDescription>Vue d'ensemble par catégorie</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/recurring-expenses">
                <BarChart className="mr-2 h-4 w-4" />
                Gérer les charges
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recurringExpenses?.map((expense, index) => (
                <div key={expense.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{expense.name}</span>
                    <span>{Math.round(expense.amount)} €</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(expense.amount / totalExpenses) * 100}%`,
                        backgroundColor: getCategoryColor(index),
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
