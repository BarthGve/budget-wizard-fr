
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StyledLoader } from "@/components/ui/StyledLoader";
import {
  calculateTotalRevenue,
  calculateMonthlyExpenses,
  calculateTotalSavings,
  calculateGlobalBalance,
  getCumulativeContributionPercentages,
  getCumulativeExpensePercentages
} from "@/utils/dashboardCalculations";
import { Credit } from "@/components/credits/types";

// Page de tableau de bord
const Dashboard = () => {
  const [currentView, setCurrentView] = useState<"monthly" | "yearly">("monthly");
  const navigate = useNavigate();
  const { contributors, monthlySavings, recurringExpenses, refetch } = useDashboardData();

  // Obtenez le nom du mois actuel
  const currentMonthName = new Date().toLocaleString('fr-FR', { month: 'long' });

  // Récupérer les crédits
  const { data: credits, isLoading: isLoadingCredits } = useQuery({
    queryKey: ["credits-for-dashboard"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("credits")
        .select("*");

      if (error) {
        console.error("Error fetching credits:", error);
        return [];
      }

      return data as Credit[];
    }
  });

  // Calcul des montants
  const totalRevenue = calculateTotalRevenue(contributors);
  const totalExpenses = calculateMonthlyExpenses(recurringExpenses);
  const totalSavings = calculateTotalSavings(monthlySavings);
  const balance = calculateGlobalBalance(totalRevenue, recurringExpenses, monthlySavings, credits);
  
  // Calcul des pourcentages
  const contributorShares = getCumulativeContributionPercentages(contributors, totalRevenue);
  const expenseShares = getCumulativeExpensePercentages(contributors, totalExpenses);

  // Définir un objectif d'épargne par défaut (peut être personnalisé plus tard)
  const savingsGoal = 1000;

  const isLoading = isLoadingCredits;

  return (
    <DashboardLayout>
      <div className="grid gap-6 mt-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-fade-in">
                Tableau de bord
              </h1>
              <p className="text-muted-foreground">
                {currentView === "monthly" 
                  ? `Aperçu du budget pour le mois de ${currentMonthName} ${new Date().getFullYear()}` 
                  : `Aperçu du budget annuel ${new Date().getFullYear()}`}
              </p>
            </div>
            <div>
              <Tabs
                defaultValue="monthly"
                onValueChange={(value) => setCurrentView(value as "monthly" | "yearly")}
                className="w-[250px]"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="monthly">Mensuel</TabsTrigger>
                  <TabsTrigger value="yearly">Annuel</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>

        {isLoading ? (
          <Card className="p-6">
            <div className="flex flex-col items-center justify-center h-64 w-full">
              <StyledLoader className="h-12 w-12 mb-4" />
              <p className="text-muted-foreground">Chargement des données...</p>
            </div>
          </Card>
        ) : contributors && contributors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Revenus</h2>
              <p className="text-3xl font-bold">{totalRevenue.toFixed(2)} €</p>
              <p className="text-sm text-muted-foreground mt-2">
                {contributors.length} contributeur{contributors.length > 1 ? 's' : ''}
              </p>
            </Card>
            
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Dépenses</h2>
              <p className="text-3xl font-bold">{totalExpenses.toFixed(2)} €</p>
              <p className="text-sm text-muted-foreground mt-2">
                {recurringExpenses?.length || 0} charge{(recurringExpenses?.length || 0) > 1 ? 's' : ''} récurrente{(recurringExpenses?.length || 0) > 1 ? 's' : ''}
              </p>
            </Card>
            
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Épargne</h2>
              <p className="text-3xl font-bold">{totalSavings.toFixed(2)} €</p>
              <p className="text-sm text-muted-foreground mt-2">
                {monthlySavings?.length || 0} épargne{(monthlySavings?.length || 0) > 1 ? 's' : ''} mensuelle{(monthlySavings?.length || 0) > 1 ? 's' : ''}
              </p>
            </Card>
            
            <Card className="p-6 col-span-full">
              <h2 className="text-xl font-semibold mb-4">Solde</h2>
              <p className={`text-3xl font-bold ${balance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {balance.toFixed(2)} €
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Solde disponible après toutes les dépenses
              </p>
            </Card>
          </div>
        ) : (
          <Card className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg p-6">
            <p className="text-lg text-gray-500 mb-4">Bienvenue sur votre tableau de bord</p>
            <p className="text-muted-foreground text-center mb-6">
              Commencez par ajouter vos sources de revenus dans la section "Revenus"
            </p>
            <Button 
              onClick={() => navigate('/contributors')}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
            >
              Ajouter des revenus
            </Button>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
