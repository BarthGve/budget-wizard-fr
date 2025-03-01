
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AddContributorDialog } from "@/components/contributors/AddContributorDialog";
import { ContributorCard } from "@/components/contributors/ContributorCard";
import { useContributors } from "@/hooks/useContributors";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import StyledLoader from "@/components/ui/StyledLoader";

const Contributors = () => {
  const {
    contributors,
    isLoading,
    addContributor,
    updateContributor,
    deleteContributor
  } = useContributors();
  
  const queryClient = useQueryClient();
  
  // Set up an additional listener to ensure dashboard data is invalidated
  useEffect(() => {
    const channel = supabase
      .channel('contributors-page-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'contributors'
        },
        () => {
          console.log('Contributors table changed, invalidating queries');
          // Utiliser une invalidation plus ciblée pour éviter les rechargements complets
          queryClient.invalidateQueries({ queryKey: ["contributors"] });
          
          // Invalidation différée des autres requêtes pour éviter les rechargements simultanés
          setTimeout(() => {
            queryClient.invalidateQueries({ queryKey: ["dashboard-data"] });
            queryClient.invalidateQueries({ queryKey: ["current-user"] });
          }, 100);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
  
  // Handle contributor operations with more targeted invalidation
  const handleAddContributor = async (newContributor) => {
    await addContributor(newContributor);
    // Invalidation plus ciblée
    queryClient.invalidateQueries({ queryKey: ["contributors"] });
    // Invalidation différée des autres données
    setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: ["dashboard-data"] });
    }, 100);
  };
  
  const handleUpdateContributor = async (contributor) => {
    await updateContributor(contributor);
    queryClient.invalidateQueries({ queryKey: ["contributors"] });
    setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: ["dashboard-data"] });
    }, 100);
  };
  
  const handleDeleteContributor = async (id) => {
    await deleteContributor(id);
    queryClient.invalidateQueries({ queryKey: ["contributors"] });
    setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: ["dashboard-data"] });
    }, 100);
  };
  
  if (isLoading) {
    return <StyledLoader/>;
  }
  
  return <DashboardLayout>
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-fade-in">Revenus</h1>
            <p className="text-muted-foreground">Indiquez vos rentrées d'argent régulières.</p>
          </div>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Listing</CardTitle>
              <CardDescription>
                Tous les contributeurs participant au budget
              </CardDescription>
            </div>
            <AddContributorDialog onAdd={handleAddContributor} />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {contributors.map(contributor => (
                <ContributorCard 
                  key={contributor.id} 
                  contributor={contributor} 
                  onEdit={handleUpdateContributor} 
                  onDelete={handleDeleteContributor} 
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>;
};

export default Contributors;
