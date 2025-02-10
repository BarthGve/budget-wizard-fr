
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Progress } from "@/components/ui/progress";
import { BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

  // Calculate total monthly savings
  const totalMonthlySavings = monthlySavings?.reduce(
    (sum, saving) => sum + saving.amount,
    0
  ) || 0;

  // Calculate savings goal based on total revenue and savings percentage
  const savingsGoal = profile?.savings_goal_percentage
    ? (totalRevenue * profile.savings_goal_percentage) / 100
    : 0;

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

  // Calculer le total des dépenses récurrentes
  const totalExpenses = recurringExpenses?.reduce((sum, expense) => sum + Number(expense.amount), 0) || 0;

  // Grouper les dépenses par catégorie
  const expensesByCategory = recurringExpenses?.reduce((acc, expense) => {
    if (!acc[expense.category]) {
      acc[expense.category] = 0;
    }
    acc[expense.category] += Number(expense.amount);
    return acc;
  }, {} as { [key: string]: number }) || {};

  // Convertir en format pour l'affichage
  const categories = Object.entries(expensesByCategory).map(([name, amount]) => ({
    name,
    amount,
    color: getCategoryColor(name),
  }));

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
          <Card className="card-hover">
            <CardHeader>
              <CardTitle>Revenus Totaux</CardTitle>
              <CardDescription>Tous contributeurs confondus</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalRevenue.toFixed(2)} €</p>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader>
              <CardTitle>Dépenses</CardTitle>
              <CardDescription>Total des charges mensuelles</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalExpenses.toFixed(2)} €</p>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader>
              <CardTitle>Objectif d'épargne</CardTitle>
              <CardDescription>Progression mensuelle</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-3xl font-bold">
                  {totalMonthlySavings.toFixed(2)} € / {savingsGoal.toFixed(2)} €
                </p>
                <Progress
                  value={savingsGoal > 0 ? (totalMonthlySavings / savingsGoal) * 100 : 0}
                />
              </div>
            </CardContent>
          </Card>
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
              {categories.map((category) => (
                <div key={category.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{category.name}</span>
                    <span>{category.amount.toFixed(2)} €</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100">
                    <div
                      className={`h-full rounded-full ${category.color}`}
                      style={{
                        width: `${(category.amount / totalExpenses) * 100}%`,
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

// Fonction utilitaire pour obtenir la couleur de la catégorie
const getCategoryColor = (category: string): string => {
  const colors: { [key: string]: string } = {
    Logement: "bg-blue-500",
    Transport: "bg-green-500",
    Alimentation: "bg-yellow-500",
    Santé: "bg-red-500",
    Loisirs: "bg-purple-500",
    Télécommunications: "bg-pink-500",
    Autres: "bg-gray-500",
  };
  return colors[category] || "bg-gray-500";
};

export default Dashboard;

