
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useParams } from "react-router-dom";

export const usePropertyDetail = () => {
  const { id } = useParams();
  const [expenseToEdit, setExpenseToEdit] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const {
    data: property,
    isLoading: isLoadingProperty
  } = useQuery({
    queryKey: ["property", id],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("properties").select("*").eq("id", id).single();
      if (error) {
        console.error("Error fetching property:", error);
        toast.error("Erreur lors du chargement de la propriété");
        throw error;
      }
      return data;
    }
  });

  const {
    data: expenses,
    isLoading: isLoadingExpenses,
    refetch: refetchExpenses
  } = useQuery({
    queryKey: ["property-expenses", id],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("property_expenses").select("*").eq("property_id", id).order("date", {
        ascending: false
      });
      if (error) {
        console.error("Error fetching expenses:", error);
        toast.error("Erreur lors du chargement des dépenses");
        throw error;
      }
      return data;
    }
  });

  const handleExpenseEdit = (expense: any) => {
    setExpenseToEdit(expense);
    setIsEditDialogOpen(true);
  };

  return {
    property,
    isLoadingProperty,
    expenses,
    isLoadingExpenses,
    refetchExpenses,
    expenseToEdit,
    isEditDialogOpen,
    setIsEditDialogOpen,
    handleExpenseEdit
  };
};
