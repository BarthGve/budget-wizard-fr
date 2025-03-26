
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Property, PropertyRecurringExpense } from "@/types/property";
import { RecurringExpense } from "@/components/recurring-expenses/types";

export const useHousing = () => {
  const queryClient = useQueryClient();

  // Récupérer le logement principal de l'utilisateur
  const {
    data: property,
    isLoading: isLoadingProperty,
    error: propertyError,
  } = useQuery({
    queryKey: ["housing-property"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("profile_id", user.id)
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error("Erreur lors de la récupération du logement :", error);
        throw error;
      }

      return data as Property | null;
    }
  });

  // Récupérer les charges récurrentes associées au logement
  const {
    data: recurringExpenses,
    isLoading: isLoadingExpenses,
    error: expensesError,
  } = useQuery({
    queryKey: ["housing-recurring-expenses", property?.id],
    queryFn: async () => {
      if (!property?.id) return [];

      const { data, error } = await supabase
        .from("property_recurring_expenses")
        .select(`
          id,
          property_id,
          recurring_expense_id,
          recurring_expenses:recurring_expense_id(*)
        `)
        .eq("property_id", property.id);

      if (error) {
        console.error("Erreur lors de la récupération des charges récurrentes :", error);
        throw error;
      }

      return data.map(item => ({
        ...item.recurring_expenses,
        property_relation_id: item.id
      })) as (RecurringExpense & { property_relation_id: string })[];
    },
    enabled: !!property?.id
  });

  // Récupérer toutes les charges récurrentes disponibles pour l'utilisateur
  const {
    data: allRecurringExpenses,
    isLoading: isLoadingAllExpenses,
  } = useQuery({
    queryKey: ["all-recurring-expenses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("recurring_expenses")
        .select("*");

      if (error) {
        console.error("Erreur lors de la récupération de toutes les charges récurrentes :", error);
        throw error;
      }

      return data as RecurringExpense[];
    }
  });

  // Créer ou mettre à jour un logement
  const createOrUpdateProperty = useMutation({
    mutationFn: async (newProperty: Property) => {
      const { data, error } = await supabase
        .from("properties")
        .upsert(newProperty)
        .select()
        .single();

      if (error) {
        console.error("Erreur lors de la création/mise à jour du logement :", error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["housing-property"] });
      toast.success("Logement enregistré avec succès");
    },
    onError: (error) => {
      console.error("Erreur mutation :", error);
      toast.error("Erreur lors de l'enregistrement du logement");
    }
  });

  // Associer une charge récurrente au logement
  const addRecurringExpense = useMutation({
    mutationFn: async (recurringExpenseId: string) => {
      if (!property?.id) throw new Error("Aucun logement trouvé");

      const { data, error } = await supabase
        .from("property_recurring_expenses")
        .insert({
          property_id: property.id,
          recurring_expense_id: recurringExpenseId
        })
        .select()
        .single();

      if (error) {
        console.error("Erreur lors de l'ajout de la charge récurrente :", error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["housing-recurring-expenses"] });
      toast.success("Charge récurrente ajoutée avec succès");
    },
    onError: (error) => {
      console.error("Erreur mutation :", error);
      toast.error("Erreur lors de l'ajout de la charge récurrente");
    }
  });

  // Dissocier une charge récurrente du logement
  const removeRecurringExpense = useMutation({
    mutationFn: async (relationId: string) => {
      const { error } = await supabase
        .from("property_recurring_expenses")
        .delete()
        .eq("id", relationId);

      if (error) {
        console.error("Erreur lors de la suppression de la charge récurrente :", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["housing-recurring-expenses"] });
      toast.success("Charge récurrente retirée avec succès");
    },
    onError: (error) => {
      console.error("Erreur mutation :", error);
      toast.error("Erreur lors du retrait de la charge récurrente");
    }
  });

  // Calcul du total annuel des charges
  const calculateYearlyTotal = () => {
    if (!recurringExpenses) return 0;
    
    return recurringExpenses.reduce((total, expense) => {
      if (expense.periodicity === "monthly") {
        return total + (expense.amount * 12);
      } else if (expense.periodicity === "quarterly") {
        return total + (expense.amount * 4);
      } else if (expense.periodicity === "yearly") {
        return total + expense.amount;
      }
      return total;
    }, 0);
  };

  return {
    property,
    isLoadingProperty,
    propertyError,
    recurringExpenses,
    isLoadingExpenses,
    expensesError,
    allRecurringExpenses,
    isLoadingAllExpenses,
    createOrUpdateProperty,
    addRecurringExpense,
    removeRecurringExpense,
    calculateYearlyTotal,
    hasProperty: !!property
  };
};
