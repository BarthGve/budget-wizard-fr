
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/useToastWrapper";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { useEffect } from "react";

interface UseExpenseFormProps {
  propertyId: string;
  expense?: any;
  onSuccess: () => void;
  onClose: () => void;
}

export function useExpenseForm({ propertyId, expense, onSuccess, onClose }: UseExpenseFormProps) {
  const form = useForm({
    defaultValues: {
      amount: "",
      category: "",
      description: "",
      date: new Date(),
    },
  });

  useEffect(() => {
    if (expense) {
      form.reset({
        amount: expense.amount.toString(),
        category: expense.category,
        description: expense.description,
        date: new Date(expense.date),
      });
    }
  }, [expense, form]);

  const onSubmit = async (values: any) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        toast.error("Vous devez être connecté pour ajouter une dépense");
        return;
      }

      let error;
      if (expense) {
        ({ error } = await supabase
          .from("property_expenses")
          .update({
            amount: Number(values.amount),
            category: values.category,
            description: values.description,
            date: format(values.date, "yyyy-MM-dd"),
          })
          .eq('id', expense.id));
      } else {
        ({ error } = await supabase
          .from("property_expenses")
          .insert({
            property_id: propertyId,
            profile_id: session.session.user.id,
            amount: Number(values.amount),
            category: values.category,
            description: values.description,
            date: format(values.date, "yyyy-MM-dd"),
          }));
      }

      if (error) throw error;

      // Le toast success est déjà filtré par notre wrapper
      
      onClose();
      form.reset();
      onSuccess();
    } catch (error) {
      console.error("Error adding/updating expense:", error);
      toast.error("Impossible d'ajouter/modifier la dépense");
    }
  };

  return { form, onSubmit };
}
