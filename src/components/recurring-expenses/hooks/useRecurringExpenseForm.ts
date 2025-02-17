
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const formSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  domain: z.string().optional(),
  amount: z.string().min(1, "Le montant est requis").refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Le montant doit être un nombre positif"),
  category: z.string().min(1, "La catégorie est requise"),
  periodicity: z.enum(["monthly", "quarterly", "yearly"]),
  debit_day: z.string().min(1, "Le jour de prélèvement est requis").refine(
    (val) => {
      const day = parseInt(val);
      return !isNaN(day) && day >= 1 && day <= 31;
    },
    "Le jour doit être entre 1 et 31"
  ),
  debit_month: z.string().nullable().refine(
    (val) => {
      if (val === null || val === "") return true;
      const month = parseInt(val);
      return !isNaN(month) && month >= 1 && month <= 12;
    },
    "Le mois doit être entre 1 et 12"
  )
});

export type FormValues = z.infer<typeof formSchema>;

interface UseRecurringExpenseFormProps {
  expense?: {
    id: string;
    name: string;
    amount: number;
    category: string;
    periodicity: "monthly" | "quarterly" | "yearly";
    debit_day: number;
    debit_month: number | null;
    logo_url?: string;
  };
  initialDomain?: string;
  onSuccess: () => void;
}

const getFaviconUrl = (domain: string) => {
  if (!domain) return "/placeholder.svg";
  const cleanDomain = domain.trim().toLowerCase();
  return `https://logo.clearbit.com/${cleanDomain}`;
};

export const useRecurringExpenseForm = ({ expense, initialDomain = "", onSuccess }: UseRecurringExpenseFormProps) => {
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: expense?.name || "",
      domain: initialDomain,
      amount: expense?.amount?.toString() || "",
      category: expense?.category || "",
      periodicity: expense?.periodicity || "monthly",
      debit_day: expense?.debit_day?.toString() || "1",
      debit_month: expense?.debit_month?.toString() || ""
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

      let debit_month = values.debit_month ? parseInt(values.debit_month) : null;
      if (values.periodicity === "monthly") {
        debit_month = null;
      }

      // Générer l'URL du logo à partir du domaine
      const logo_url = getFaviconUrl(values.domain || "");

      const expenseData = {
        name: values.name,
        amount: Number(values.amount),
        category: values.category,
        periodicity: values.periodicity,
        debit_day: parseInt(values.debit_day),
        debit_month: debit_month,
        logo_url,
      };

      if (expense) {
        const { error } = await supabase
          .from("recurring_expenses")
          .update(expenseData)
          .eq("id", expense.id);

        if (error) throw error;
        toast.success("Charge récurrente mise à jour avec succès");
      } else {
        const { error } = await supabase.from("recurring_expenses").insert({
          ...expenseData,
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
