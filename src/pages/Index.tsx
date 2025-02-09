
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Progress } from "@/components/ui/progress";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

const Dashboard = () => {
  // Données temporaires pour la démo
  const budget = {
    totalRevenue: 5000,
    totalExpenses: 3000,
    savingsGoal: 1000,
    currentSavings: 750,
  };

  const [recurringExpenses, setRecurringExpenses] = useState([
    { id: 1, name: "Loyer", amount: 1200, category: "Logement" },
    { id: 2, name: "Électricité", amount: 80, category: "Logement" },
    { id: 3, name: "Internet", amount: 40, category: "Télécommunications" },
    { id: 4, name: "Transport", amount: 75, category: "Transport" },
  ]);

  const categories = [
    { name: "Logement", amount: 1200, color: "bg-blue-500" },
    { name: "Transport", amount: 400, color: "bg-green-500" },
    { name: "Alimentation", amount: 600, color: "bg-yellow-500" },
    { name: "Loisirs", amount: 300, color: "bg-purple-500" },
  ];

  const handleDeleteExpense = (id: number) => {
    setRecurringExpenses((prev) => prev.filter((expense) => expense.id !== id));
    toast.success("Dépense supprimée avec succès");
  };

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

        {/* Charges mensuelles récurrentes */}
        <Card className="col-span-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle>Charges Mensuelles Récurrentes</CardTitle>
              <CardDescription>Gérez vos dépenses récurrentes par catégorie</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="ml-auto">
              <Plus className="mr-2 h-4 w-4" />
              Ajouter une charge
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recurringExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between border-b pb-3"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{expense.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Catégorie: {expense.category}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <p className="font-medium">{expense.amount} €</p>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteExpense(expense.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Répartition des dépenses */}
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>Répartition des Dépenses</CardTitle>
            <CardDescription>Par catégorie</CardDescription>
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
