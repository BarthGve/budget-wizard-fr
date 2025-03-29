
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { SubmitHandler } from "react-hook-form";
import { useState } from "react";

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
  debit_month: z.string().nullish().refine(
    (val) => {
      if (val === null || val === "" || val === undefined) return true;
      const month = parseInt(val);
      return !isNaN(month) && month >= 1 && month <= 12;
    },
    "Le mois doit être entre 1 et 12"
  ),
  // Champs pour les véhicules
  vehicle_id: z.string().optional().nullable(),
  vehicle_expense_type: z.string().optional().nullable(),
  auto_generate_vehicle_expense: z.boolean().optional()
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
    vehicle_id?: string | null;
    vehicle_expense_type?: string | null;
    auto_generate_vehicle_expense?: boolean;
  };
  initialDomain?: string;
  onSuccess: (data?: any) => void;
}

const getFaviconUrl = (domain: string) => {
  if (!domain) return "/placeholder.svg";
  const cleanDomain = domain.trim().toLowerCase();
  return `https://logo.clearbit.com/${cleanDomain}`;
};

export const useRecurringExpenseForm = ({ expense, initialDomain = "", onSuccess }: UseRecurringExpenseFormProps) => {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Log initial pour déboguer les valeurs par défaut
  console.log("useRecurringExpenseForm - Initialisation avec expense:", expense);
  console.log("useRecurringExpenseForm - Domaine initial:", initialDomain);

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
      // Initialiser les champs de véhicule avec les valeurs correctes
      vehicle_id: expense?.vehicle_id || null,
      vehicle_expense_type: expense?.vehicle_expense_type || null,
      auto_generate_vehicle_expense: expense?.auto_generate_vehicle_expense || false
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      if (!user) {
        toast.error("Vous devez être connecté pour effectuer cette action");
        return;
      }

      let debit_month = data.debit_month ? parseInt(data.debit_month) : null;
      if (data.periodicity === "monthly") {
        debit_month = null;
      }

      // Générer l'URL du logo à partir du domaine
      const logo_url = getFaviconUrl(data.domain || "");

      // S'assurer que les valeurs sont correctement typées pour la BD
      const expenseData = {
        name: data.name,
        amount: Number(data.amount),
        category: data.category,
        periodicity: data.periodicity,
        debit_day: parseInt(data.debit_day),
        debit_month: debit_month,
        logo_url,
        // Assurer que les valeurs liées au véhicule sont correctement traitées
        vehicle_id: data.vehicle_id || null, // Utiliser null explicitement si vide
        vehicle_expense_type: data.vehicle_expense_type || null,
        auto_generate_vehicle_expense: Boolean(data.auto_generate_vehicle_expense)
      };

      console.log("Données à enregistrer dans la BD:", expenseData);

      if (expense?.id) {
        // Mise à jour d'une charge existante
        const { error } = await supabase
          .from("recurring_expenses")
          .update(expenseData)
          .eq("id", expense.id);

        if (error) throw error;
        toast.success("Charge récurrente mise à jour avec succès");
        
        // Invalidation des requêtes
        updateQueriesAfterSave(data.vehicle_id);
        
        onSuccess({
          ...expenseData,
          id: expense.id // Inclure l'ID dans les données renvoyées
        });
      } else {
        // Création d'une nouvelle charge
        const { data: savedData, error } = await supabase
          .from("recurring_expenses")
          .insert({
            ...expenseData,
            profile_id: user.id,
          })
          .select();

        if (error) throw error;
        toast.success("Charge récurrente ajoutée avec succès");
        
        // Invalidation des requêtes
        updateQueriesAfterSave(data.vehicle_id);
        
        // Passer les données complètes (y compris l'ID généré) au callback de succès
        onSuccess(savedData?.[0] || expenseData);
      }
      
      form.reset();
    } catch (error) {
      console.error("Error saving recurring expense:", error);
      toast.error(
        expense?.id
          ? "Erreur lors de la mise à jour de la charge récurrente"
          : "Erreur lors de l'ajout de la charge récurrente"
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Fonction d'aide pour l'invalidation des requêtes
  const updateQueriesAfterSave = (vehicleId: string | null | undefined) => {
    // Invalidation des requêtes pour mettre à jour les données
    queryClient.invalidateQueries({ queryKey: ["recurring-expenses"] });
    
    // Ajouter l'invalidation du dashboard pour mettre à jour la balance globale
    queryClient.invalidateQueries({ 
      queryKey: ["dashboard-data"],
      exact: false,
    });
    
    // Invalider les données des véhicules si une charge récurrente est associée à un véhicule
    if (vehicleId) {
      queryClient.invalidateQueries({ 
        queryKey: ["vehicle-expenses", vehicleId],
        exact: true
      });
      
      queryClient.invalidateQueries({ 
        queryKey: ["vehicle-detail", vehicleId],
        exact: false
      });
    }
  };

  return {
    form,
    handleSubmit: form.handleSubmit(onSubmit),
    isSubmitting
  };
};
