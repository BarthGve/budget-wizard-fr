
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
        toast.error("Erreur lors du chargement des données de l'enseigne");
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
        toast.error("Erreur lors du chargement des dépenses");
        throw error;
      }

      console.log("Expenses fetched successfully, count:", data?.length);
      return data;
    },
    enabled: !!retailerId
  });

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
        toast.error("Erreur lors de la suppression de la dépense");
        return;
      }

      toast.success("Dépense supprimée avec succès");
      refetchExpenses();
    } catch (error) {
      console.error("Error in delete operation:", error);
      toast.error("Une erreur s'est produite");
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
