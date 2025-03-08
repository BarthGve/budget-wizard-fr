
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import StyledLoader from "@/components/ui/StyledLoader";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RecurringExpensesPieChart } from "@/components/dashboard/RecurringExpensesPieChart";
import { CreditsPieChart } from "@/components/dashboard/CreditsPieChart";
import { SavingsPieChart } from "@/components/dashboard/SavingsPieChart";
import {
  calculateTotalRevenue,
  calculateMonthlyExpenses,
  calculateTotalSavings,
  calculateGlobalBalance,
} from "@/utils/dashboardCalculations";
import { Credit } from "@/components/credits/types";
import { BadgeEuro, CreditCard, PiggyBank, ShoppingBasket } from "lucide-react";

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
  
  // Montants prédéfinis pour la démo (à adapter selon vos besoins réels)
  const demo = {
    revenus: 3695,
    charges: 950,
    credits: 65,
    epargne: 1011,
    cibleEpargne: 1219,
    resteEpargne: 208,
    payé: 259,
    resteCharges: 691
  };

  // Pour la barre de progression des charges
  const chargeProgress = (demo.payé / demo.charges) * 100;
  // Pour la barre de progression de l'épargne
  const epargneProgress = (demo.epargne / demo.cibleEpargne) * 100;
  // Pourcentage remboursement crédit
  const creditProgress = 2; // 2%

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
              <StyledLoader />
              <p className="text-muted-foreground">Chargement des données...</p>
            </div>
          </Card>
        ) : contributors && contributors.length > 0 ? (
          <>
            {/* Première rangée de cartes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Revenus globaux */}
              <Card className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h2 className="text-xl font-bold">Revenus globaux</h2>
                    <p className="text-sm text-muted-foreground">Somme de l'ensemble des revenus</p>
                  </div>
                  <BadgeEuro className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-3xl font-bold mt-4">{demo.revenus} €</p>
              </Card>
              
              {/* Charges */}
              <Card className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h2 className="text-xl font-bold">Charges</h2>
                    <p className="text-sm text-muted-foreground">Du mois de {currentMonthName}</p>
                  </div>
                  <ShoppingBasket className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-3xl font-bold mt-2">{demo.charges} €</p>
                <Progress value={chargeProgress} className="h-2 mt-2" />
                <div className="flex justify-between mt-1">
                  <p className="text-sm text-muted-foreground">Payé : {demo.payé} €</p>
                  <p className="text-sm text-muted-foreground">Reste : {demo.resteCharges} €</p>
                </div>
              </Card>
              
              {/* Crédits */}
              <Card className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h2 className="text-xl font-bold">Crédits</h2>
                    <p className="text-sm text-muted-foreground">Vue d'ensemble des crédits</p>
                  </div>
                  <CreditCard className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-3xl font-bold mt-2">{demo.credits} €</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-sm text-muted-foreground">Mensualités totales</p>
                  <span className="bg-purple-500 text-white text-xs font-medium px-2 py-0.5 rounded">
                    {creditProgress}%
                  </span>
                </div>
              </Card>
              
              {/* Épargne */}
              <Card className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h2 className="text-xl font-bold">Epargne</h2>
                    <p className="text-sm text-muted-foreground">Suivi d'objectif</p>
                  </div>
                  <PiggyBank className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-3xl font-bold mt-2">{demo.epargne} €</p>
                <Progress value={epargneProgress} className="h-2 mt-2" />
                <div className="flex justify-between mt-1">
                  <p className="text-sm text-muted-foreground">Cible : {demo.cibleEpargne} €</p>
                  <p className="text-sm text-red-500 font-medium">Reste : {demo.resteEpargne} €</p>
                </div>
              </Card>
            </div>

            {/* Deuxième rangée de graphiques */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
              {/* Charges Pie Chart */}
              <RecurringExpensesPieChart 
                recurringExpenses={recurringExpenses || []} 
                totalExpenses={demo.charges} 
              />
              
              {/* Crédits Pie Chart */}
              <CreditsPieChart 
                credits={credits || []} 
                totalCredits={demo.credits} 
              />
              
              {/* Epargne Pie Chart */}
              <SavingsPieChart 
                monthlySavings={monthlySavings || []} 
                totalSavings={demo.epargne} 
              />
            </div>
          </>
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
