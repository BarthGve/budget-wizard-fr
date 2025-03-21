
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
  debit_month: z.string().nullable().optional().refine(
    (val) => {
      if (val === null || val === "" || val === undefined) return true;
      const month = parseInt(val);
      return !isNaN(month) && month >= 1 && month <= 12;
    },
    "Le mois doit être entre 1 et 12"
  ),
  // Nouveaux champs pour l'association avec un véhicule
  vehicle_id: z.string().optional(),
  vehicle_expense_type: z.string().optional(),
  auto_generate_vehicle_expense: z.boolean().optional().default(false)
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
    vehicle_id?: string;
    vehicle_expense_type?: string;
    auto_generate_vehicle_expense?: boolean;
  };
  initialDomain?: string;
  initialVehicleId?: string;
  onSuccess: () => void;
}

const getFaviconUrl = (domain: string) => {
  if (!domain) return "/placeholder.svg";
  const cleanDomain = domain.trim().toLowerCase();
  return `https://logo.clearbit.com/${cleanDomain}`;
};

export const useRecurringExpenseForm = ({ expense, initialDomain = "", initialVehicleId = "", onSuccess }: UseRecurringExpenseFormProps) => {
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
      debit_month: expense?.debit_month?.toString() || null,
      vehicle_id: expense?.vehicle_id || initialVehicleId || "",
      vehicle_expense_type: expense?.vehicle_expense_type || "",
      auto_generate_vehicle_expense: expense?.auto_generate_vehicle_expense || false
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
        // Nouveaux champs pour l'association avec un véhicule
        vehicle_id: values.vehicle_id || null,
        vehicle_expense_type: values.vehicle_expense_type || null,
        auto_generate_vehicle_expense: values.auto_generate_vehicle_expense || false
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

      // Invalidation des requêtes pour mettre à jour les données
      queryClient.invalidateQueries({ queryKey: ["recurring-expenses"] });
      
      // Ajouter l'invalidation du dashboard pour mettre à jour la balance globale
      queryClient.invalidateQueries({ 
        queryKey: ["dashboard-data"],
        exact: false,
        refetchType: 'all'
      });
      
      // Invalider les données des véhicules si une charge récurrente est associée à un véhicule
      if (values.vehicle_id) {
        queryClient.invalidateQueries({ 
          queryKey: ["vehicle-expenses", values.vehicle_id],
          exact: true
        });
        
        queryClient.invalidateQueries({ 
          queryKey: ["vehicle-detail", values.vehicle_id],
          exact: false
        });
      }
      
      // Force refresh immédiat
      setTimeout(() => {
        queryClient.refetchQueries({ 
          queryKey: ["dashboard-data"],
          exact: false
        });
      }, 100);
      
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
