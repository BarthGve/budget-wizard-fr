
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const formSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  amount: z.string().min(1, "Le montant est requis").refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Le montant doit être un nombre positif"),
  category: z.string().min(1, "La catégorie est requise"),
});

export type FormValues = z.infer<typeof formSchema>;

interface UseRecurringExpenseFormProps {
  expense?: {
    id: string;
    name: string;
    amount: number;
    category: string;
  };
  onSuccess: () => void;
}

export const useRecurringExpenseForm = ({ expense, onSuccess }: UseRecurringExpenseFormProps) => {
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: expense?.name || "",
      amount: expense?.amount?.toString() || "",
      category: expense?.category || "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      if (!user) {
        toast.error("Vous devez être connecté pour effectuer cette action");
        return;
      }

      if (expense) {
        const { error } = await supabase
          .from("recurring_expenses")
          .update({
            name: values.name,
            amount: Number(values.amount),
            category: values.category,
          })
          .eq("id", expense.id);

        if (error) throw error;
        toast.success("Charge récurrente mise à jour avec succès");
      } else {
        const { error } = await supabase.from("recurring_expenses").insert({
          name: values.name,
          amount: Number(values.amount),
          category: values.category,
          profile_id: user.id,
        });

        if (error) throw error;
        toast.success("Charge récurrente ajoutée avec succès");
      }

      queryClient.invalidateQueries({ queryKey: ["recurring-expenses"] });
      onSuccess();
      form.reset();
    } catch (error) {
      console.error("Error saving recurring expense:", error);
      toast.error(
        expense
          ? "Erreur lors de la mise à jour de la charge récurrente"
          : "Erreur lors de l'ajout de la charge récurrente"
      );
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
  };
};
