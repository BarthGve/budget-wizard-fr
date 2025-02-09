
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

const Dashboard = () => {
  // Données temporaires pour la démo
  const budget = {
    totalRevenue: 5000,
    totalExpenses: 3000,
    savingsGoal: 1000,
    currentSavings: 750,
  };

  const categories = [
    { name: "Logement", amount: 1200, color: "bg-blue-500" },
    { name: "Transport", amount: 400, color: "bg-green-500" },
    { name: "Alimentation", amount: 600, color: "bg-yellow-500" },
    { name: "Loisirs", amount: 300, color: "bg-purple-500" },
  ];

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
              <p className="text-3xl font-bold">{budget.totalRevenue} €</p>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader>
              <CardTitle>Dépenses</CardTitle>
              <CardDescription>Total des charges mensuelles</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{budget.totalExpenses} €</p>
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
                  {budget.currentSavings} € / {budget.savingsGoal} €
                </p>
                <Progress
                  value={(budget.currentSavings / budget.savingsGoal) * 100}
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
                    <span>{category.amount} €</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100">
                    <div
                      className={`h-full rounded-full ${category.color}`}
                      style={{
                        width: `${(category.amount / budget.totalExpenses) * 100}%`,
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
