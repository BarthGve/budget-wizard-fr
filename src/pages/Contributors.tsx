
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AddContributorDialog } from "@/components/contributors/AddContributorDialog";
import { ContributorCard } from "@/components/contributors/ContributorCard";
import { useContributors } from "@/hooks/useContributors";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import StyledLoader from "@/components/ui/StyledLoader";

const CHANNEL_KEY = 'contributors-page-subscription';

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
  const [isSubscribed, setIsSubscribed] = useState(false);
  
  // Optimisation de l'écouteur pour éviter les multiples abonnements
  useEffect(() => {
    // Éviter de créer des abonnements multiples
    if (isSubscribed) return;
    
    // Nettoyer le channel précédent s'il existe
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }
    
    // Créer un canal avec une clé statique
    const channel = supabase
      .channel(CHANNEL_KEY)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'contributors'
        },
        (payload) => {
          console.log('New contributor added, updating cache');
          // Mettre à jour les données dans le cache au lieu d'invalider
          queryClient.setQueryData(['contributors'], (oldData) => {
            if (!oldData) return [payload.new];
            return [...oldData, payload.new];
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'contributors'
        },
        (payload) => {
          console.log('Contributor updated, updating cache');
          queryClient.setQueryData(['contributors'], (oldData) => {
            if (!oldData) return [payload.new];
            return oldData.map(item => 
              item.id === payload.new.id ? payload.new : item
            );
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'contributors'
        },
        (payload) => {
          console.log('Contributor deleted, updating cache');
          queryClient.setQueryData(['contributors'], (oldData) => {
            if (!oldData) return [];
            return oldData.filter(item => item.id !== payload.old.id);
          });
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setIsSubscribed(true);
        }
      });
    
    // Stocker la référence du channel
    channelRef.current = channel;

    // Cleanup function
    return () => {
      if (channelRef.current) {
        console.log('Removing channel from Contributors page');
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
        setIsSubscribed(false);
      }
    };
  }, [queryClient, isSubscribed]);
  
  // Optimiser les gestionnaires avec mise à jour optimiste
  const handleAddContributor = async (newContributor) => {
    // Mise à jour optimiste
    const tempId = `temp-${Date.now()}`;
    const optimisticContributor = { ...newContributor, id: tempId };
    
    queryClient.setQueryData(['contributors'], (oldData) => {
      if (!oldData) return [optimisticContributor];
      return [...oldData, optimisticContributor];
    });
    
    try {
      // Appel API réel
      await addContributor(newContributor);
      // L'abonnement Supabase mettra à jour le cache avec les vraies données
    } catch (error) {
      // En cas d'erreur, revenir aux données précédentes
      queryClient.setQueryData(['contributors'], (oldData) => {
        if (!oldData) return [];
        return oldData.filter(item => item.id !== tempId);
      });
      console.error('Failed to add contributor:', error);
    }
  };
  
  const handleUpdateContributor = async (contributor) => {
    // Sauvegarder l'état précédent
    const previousContributors = queryClient.getQueryData(['contributors']);
    
    // Mise à jour optimiste
    queryClient.setQueryData(['contributors'], (oldData) => {
      if (!oldData) return [contributor];
      return oldData.map(item => 
        item.id === contributor.id ? contributor : item
      );
    });
    
    try {
      // Appel API réel
      await updateContributor(contributor);
      // L'abonnement Supabase mettra à jour le cache avec les vraies données
    } catch (error) {
      // En cas d'erreur, revenir aux données précédentes
      queryClient.setQueryData(['contributors'], previousContributors);
      console.error('Failed to update contributor:', error);
    }
  };
  
  const handleDeleteContributor = async (id) => {
    // Sauvegarder l'état précédent
    const previousContributors = queryClient.getQueryData(['contributors']);
    
    // Mise à jour optimiste
    queryClient.setQueryData(['contributors'], (oldData) => {
      if (!oldData) return [];
      return oldData.filter(item => item.id !== id);
    });
    
    try {
      // Appel API réel
      await deleteContributor(id);
      // L'abonnement Supabase confirmera la suppression
    } catch (error) {
      // En cas d'erreur, revenir aux données précédentes
      queryClient.setQueryData(['contributors'], previousContributors);
      console.error('Failed to delete contributor:', error);
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