
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useContributors } from "@/hooks/useContributors";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import StyledLoader from "@/components/ui/StyledLoader";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AddContributorDialog } from "@/components/contributors/AddContributorDialog";
import { ContributorCard } from "@/components/contributors/ContributorCard";
import { RevenueCard } from "@/components/dashboard/RevenueCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const Contributors = () => {
  const {
    contributors,
    isLoading,
    addContributor,
    updateContributor,
    deleteContributor
  } = useContributors();
  
  const [showAddDialog, setShowAddDialog] = useState(false);
  const queryClient = useQueryClient();
  const channelRef = useRef(null);
  
  // Données d'historique fictives pour le graphique (peut être remplacé par des données réelles)
  const revenueHistory = Array.from({ length: 12 }, (_, i) => ({
    date: `2023-${i + 1}`,
    value: Math.floor(Math.random() * 1000) + 5000
  }));
  
  // Total des revenus
  const totalRevenue = contributors?.reduce((sum, contributor) => 
    sum + contributor.total_contribution, 0) || 0;
  
  // Préparer les données pour le graphique en camembert
  const pieChartData = contributors.map(contributor => ({
    name: contributor.name,
    value: contributor.total_contribution,
    percentage: contributor.percentage_contribution
  }));
  
  // Couleurs pour le graphique
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  // Optimisation de l'écouteur pour éviter les multiples abonnements et invalidations
  useEffect(() => {
    // Nettoyer le channel précédent s'il existe
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }
    
    // Créer un nouveau channel avec une clé unique pour cette instance de composant
    const channel = supabase
      .channel('contributors-page-' + Date.now())
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'contributors'
        },
        (payload) => {
          console.log('Contributors table changed, invalidating queries');
          // N'invalider que les requêtes spécifiques pour éviter les rechargements complets
          queryClient.invalidateQueries({ queryKey: ["contributors"] });
          queryClient.invalidateQueries({ queryKey: ["dashboard-data"] });
        }
      )
      .subscribe();
    
    // Stocker la référence du channel
    channelRef.current = channel;

    // Cleanup function - très important pour éviter les fuites mémoire
    return () => {
      if (channelRef.current) {
        console.log('Removing channel from Contributors page');
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [queryClient]);
  
  // Optimiser les gestionnaires pour éviter les invalidations multiples
  const handleAddContributor = async (newContributor) => {
    await addContributor(newContributor);
    setShowAddDialog(false);
    // L'invalidation est déjà gérée par le hook useContributors et l'écouteur
  };
  
  const handleUpdateContributor = async (contributor) => {
    await updateContributor(contributor);
    // L'invalidation est déjà gérée par le hook useContributors et l'écouteur
  };
  
  const handleDeleteContributor = async (id) => {
    await deleteContributor(id);
    // L'invalidation est déjà gérée par le hook useContributors et l'écouteur
  };
  
  if (isLoading) {
    return <StyledLoader />;
  }
  
  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-fade-in">Revenus</h1>
            <p className="text-muted-foreground">Indiquez vos rentrées d'argent régulières.</p>
          </div>
          <Button onClick={() => setShowAddDialog(true)} className="ml-auto">
            <Plus className="mr-2 h-4 w-4" /> Ajouter
          </Button>
        </div>

        {/* Section des cartes de données */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <RevenueCard 
            totalRevenue={totalRevenue} 
            contributorShares={[]} 
            history={revenueHistory}
            previousRevenue={revenueHistory[10]?.value || 0}
          />
          
          <Card className="bg-background hover:shadow-md transition-all duration-300">
            <CardHeader className="py-[16px]">
              <CardTitle>Répartition des revenus</CardTitle>
              <CardDescription>Distribution par contributeur</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center p-0">
              {pieChartData.length > 0 ? (
                <ChartContainer className="h-[230px] w-full" config={{}}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <ChartLegend verticalAlign="bottom">
                        <ChartLegendContent />
                      </ChartLegend>
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  Aucun contributeur à afficher
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="bg-background hover:shadow-md transition-all duration-300">
            <CardHeader className="py-[16px]">
              <CardTitle>Nombre de contributeurs</CardTitle>
              <CardDescription>Personnes participant au budget</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center h-[200px]">
              <span className="text-4xl font-bold">{contributors.length}</span>
              <span className="text-muted-foreground mt-2">participants au total</span>
            </CardContent>
          </Card>
        </div>

        {/* Section liste des contributeurs */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Listing des contributeurs</CardTitle>
              <CardDescription>
                Tous les contributeurs participant au budget
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {contributors.length > 0 ? (
                contributors.map(contributor => (
                  <ContributorCard 
                    key={contributor.id} 
                    contributor={contributor} 
                    onEdit={handleUpdateContributor} 
                    onDelete={handleDeleteContributor} 
                  />
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Aucun contributeur ajouté. Cliquez sur "Ajouter" pour créer votre premier contributeur.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <AddContributorDialog 
        isOpen={showAddDialog}
        onOpenChange={setShowAddDialog}
        onAdd={handleAddContributor} 
      />
    </DashboardLayout>
  );
};

export default Contributors;
