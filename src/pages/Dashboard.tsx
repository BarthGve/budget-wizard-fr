
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

// Page de tableau de bord par défaut
const Dashboard = () => {
  const [currentView, setCurrentView] = useState<"monthly" | "yearly">("monthly");
  const navigate = useNavigate();

  // Obtenez le nom du mois actuel
  const currentMonthName = new Date().toLocaleString('fr-FR', { month: 'long' });

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

        <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
          <p className="text-lg text-gray-500">Bienvenue sur votre tableau de bord</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
