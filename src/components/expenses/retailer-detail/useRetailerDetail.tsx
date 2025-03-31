
import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface Expense {
  id: string;
  date: string;
  amount: number;
  comment?: string;
  retailer_id: string;
}

export function useRetailerDetail(retailerId: string | undefined) {
  const [expenseToEdit, setExpenseToEdit] = useState<Expense | null>(null);
  const [expenseToView, setExpenseToView] = useState<Expense | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [addExpenseDialogOpen, setAddExpenseDialogOpen] = useState(false);
  const channelRef = useRef<any>(null);

  // Requête pour récupérer les informations du détaillant
  const { data: retailer, isLoading: isLoadingRetailer } = useQuery({
    queryKey: ["retailer", retailerId],
    queryFn: async () => {
      console.log("Fetching retailer with id:", retailerId);
      const { data, error } = await supabase
        .from("retailers")
        .select("*")
        .eq("id", retailerId)
        .single();

      if (error) {
        console.error("Error fetching retailer:", error);
        toast({
          title: "Erreur",
          description: "Erreur lors du chargement des données de l'enseigne",
          variant: "destructive",
        });
        throw error;
      }

      console.log("Retailer data fetched successfully:", data);
      return data;
    }
  });

  // Requête pour récupérer les dépenses du détaillant
  const { data: expenses, isLoading: isLoadingExpenses, refetch: refetchExpenses } = useQuery({
    queryKey: ["retailer-expenses", retailerId],
    queryFn: async () => {
      console.log("Fetching expenses for retailer:", retailerId);
      const { data, error } = await supabase
        .from("expenses")
        .select("*")
        .eq("retailer_id", retailerId)
        .order("date", { ascending: false });

      if (error) {
        console.error("Error fetching expenses:", error);
        toast({
          title: "Erreur",
          description: "Erreur lors du chargement des dépenses",
          variant: "destructive",
        });
        throw error;
      }

      console.log("Expenses fetched successfully, count:", data?.length);
      return data;
    },
    enabled: !!retailerId
  });

  // Configuration d'un écouteur realtime pour les dépenses
  useEffect(() => {
    if (!retailerId) return;

    // Nettoyer l'ancien canal s'il existe
    if (channelRef.current) {
      console.log("Nettoyage du canal existant");
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    // Créer un canal pour écouter les changements sur la table expenses
    const channelId = `expenses-changes-${retailerId}-${Date.now()}`;
    console.log(`Création d'un nouveau canal: ${channelId}`);
    
    const channel = supabase
      .channel(channelId)
      .on(
        'postgres_changes',
        {
          event: '*', // Écouter tous les événements (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'expenses',
          filter: `retailer_id=eq.${retailerId}`
        },
        (payload) => {
          console.log(`Changement détecté pour les dépenses:`, payload);
          // Rafraîchir les données automatiquement
          refetchExpenses();
        }
      )
      .subscribe((status) => {
        console.log(`Statut du canal ${channelId}:`, status);
      });

    channelRef.current = channel;

    // Nettoyage lors du démontage du composant
    return () => {
      console.log(`Nettoyage du canal ${channelId} lors du démontage`);
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [retailerId, refetchExpenses]);

  // Fonctions de gestion des dépenses
  const handleViewExpenseDetails = (expense: Expense) => {
    setExpenseToView(expense);
    setDetailsDialogOpen(true);
  };

  const handleEditExpense = (expense: Expense) => {
    setExpenseToEdit(expense);
    setEditDialogOpen(true);
  };

  const handleDeleteExpense = async (expenseId: string) => {
    try {
      const { error } = await supabase
        .from("expenses")
        .delete()
        .eq("id", expenseId);

      if (error) {
        console.error("Error deleting expense:", error);
        toast({
          title: "Erreur",
          description: "Erreur lors de la suppression de la dépense",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Succès",
        description: "Dépense supprimée avec succès",
      });
      refetchExpenses();
    } catch (error) {
      console.error("Error in delete operation:", error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite",
        variant: "destructive",
      });
    }
  };

  const handleExpenseUpdated = () => {
    setEditDialogOpen(false);
    setAddExpenseDialogOpen(false);
    refetchExpenses();
  };

  const handleAddExpense = () => {
    setAddExpenseDialogOpen(true);
  };

  return {
    retailer,
    expenses,
    isLoadingRetailer,
    isLoadingExpenses,
    expenseToEdit,
    expenseToView,
    editDialogOpen,
    detailsDialogOpen,
    addExpenseDialogOpen,
    setEditDialogOpen,
    setDetailsDialogOpen,
    setAddExpenseDialogOpen,
    handleViewExpenseDetails,
    handleEditExpense,
    handleDeleteExpense,
    handleExpenseUpdated,
    handleAddExpense,
    refetchExpenses
  };
}
