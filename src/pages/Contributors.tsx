
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AddContributorDialog } from "@/components/contributors/AddContributorDialog";
import { ContributorCard } from "@/components/contributors/ContributorCard";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import StyledLoader from "@/components/ui/StyledLoader";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Contributor } from "@/types/contributor";
import { fetchContributorsService } from "@/services/contributors";

const Contributors = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Vérification de l'authentification comme dans Properties.tsx
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate]);

  // Configuration d'un écouteur Supabase unique avec cleanup approprié
  useEffect(() => {
    const channelId = `contributors-realtime-${Date.now()}`;
    console.log(`Setting up realtime subscription with channel ID: ${channelId}`);
    
    const channel = supabase
      .channel(channelId)
      .on(
        'postgres_changes',
        {
          event: '*', // Écouter tous les événements (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'contributors'
        },
        () => {
          // Invalider uniquement la requête des contributeurs sans recharger toute la page
          queryClient.invalidateQueries({ queryKey: ["contributors"] });
        }
      )
      .subscribe((status) => {
        console.log(`Supabase realtime status for contributors: ${status}`);
      });

    return () => {
      console.log(`Cleaning up channel: ${channelId}`);
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  // Utilisation de useQuery avec fetchContributorsService
  const { data: contributors = [], isLoading } = useQuery({
    queryKey: ["contributors"],
    queryFn: fetchContributorsService
  });

  // Fonctions de gestion des contributeurs avec mises à jour optimistes
  const handleAddContributor = async (newContributor: any) => {
    const optimisticId = `temp-${Date.now()}`;
    queryClient.setQueryData(["contributors"], (old: Contributor[] = []) => [
      { ...newContributor, id: optimisticId } as Contributor,
      ...old
    ]);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Conversion du string en number pour total_contribution
      const contributorToAdd = {
        ...newContributor,
        profile_id: user.id,
        total_contribution: parseFloat(newContributor.total_contribution)
      };

      const { data, error } = await supabase
        .from("contributors")
        .insert([contributorToAdd])
        .select()
        .single();

      if (error) throw error;

      // Mise à jour avec les vraies données du serveur
      queryClient.setQueryData(["contributors"], (old: Contributor[] = []) => 
        old.map(item => item.id === optimisticId ? data : item)
      );

      toast.success("Contributeur ajouté avec succès");
    } catch (error) {
      console.error("Error adding contributor:", error);
      toast.error("Erreur lors de l'ajout du contributeur");
      
      // Revenir à l'état précédent en cas d'erreur
      queryClient.invalidateQueries({ queryKey: ["contributors"] });
    }
  };

  const handleUpdateContributor = async (contributor: Contributor) => {
    // Sauvegarde de l'état précédent
    const previousData = queryClient.getQueryData(["contributors"]);
    
    // Mise à jour optimiste
    queryClient.setQueryData(["contributors"], (old: Contributor[] = []) => 
      old.map(item => item.id === contributor.id ? contributor : item)
    );
    
    try {
      const { error } = await supabase
        .from("contributors")
        .update(contributor)
        .eq("id", contributor.id);

      if (error) throw error;
      
      toast.success("Contributeur mis à jour avec succès");
    } catch (error) {
      console.error("Error updating contributor:", error);
      toast.error("Erreur lors de la mise à jour du contributeur");
      
      // Revenir à l'état précédent en cas d'erreur
      queryClient.setQueryData(["contributors"], previousData);
    }
  };

  const handleDeleteContributor = async (id: string) => {
    // Sauvegarde de l'état précédent
    const previousData = queryClient.getQueryData(["contributors"]);
    
    // Mise à jour optimiste
    queryClient.setQueryData(["contributors"], (old: Contributor[] = []) => 
      old.filter(item => item.id !== id)
    );
    
    try {
      const { error } = await supabase
        .from("contributors")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      toast.success("Contributeur supprimé avec succès");
    } catch (error) {
      console.error("Error deleting contributor:", error);
      toast.error("Erreur lors de la suppression du contributeur");
      
      // Revenir à l'état précédent en cas d'erreur
      queryClient.setQueryData(["contributors"], previousData);
    }
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
              {contributors.map((contributor: Contributor) => (
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
