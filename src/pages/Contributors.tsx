
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AddContributorDialog } from "@/components/contributors/AddContributorDialog";
import { ContributorCard } from "@/components/contributors/ContributorCard";
import { useContributors } from "@/hooks/useContributors";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
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
  const channelRef = useRef(null);
  
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
