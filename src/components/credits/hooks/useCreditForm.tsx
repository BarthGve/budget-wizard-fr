
import { Credit } from "../types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { addMonths } from "date-fns";
import { toast } from "sonner";

// Schéma de validation pour le formulaire
const creditFormSchema = z.object({
  name: z.string().min(1, "Le nom est obligatoire"),
  domain: z.string().min(1, "Le domaine est obligatoire"),
  amount: z.string().min(1, "Le montant est obligatoire"),
  firstPaymentDate: z.date(),
  monthsCount: z.string().min(1, "Le nombre de mensualités est obligatoire"),
  associate_with_vehicle: z.boolean().default(false).optional(),
  vehicle_id: z.string().nullable().optional(),
  vehicle_expense_type: z.string().nullable().optional(),
  auto_generate_vehicle_expense: z.boolean().default(false).optional(),
});

// Type pour les valeurs du formulaire
export type CreditFormValues = z.infer<typeof creditFormSchema>;

interface UseCreditFormProps {
  credit?: Credit;
  onSuccess: () => void;
}

export const useCreditForm = ({ credit, onSuccess }: UseCreditFormProps) => {
  // Initialisation du formulaire avec les valeurs du crédit si disponible
  const form = useForm<CreditFormValues>({
    resolver: zodResolver(creditFormSchema),
    defaultValues: credit
      ? {
          name: credit.nom_credit,
          domain: credit.nom_domaine,
          amount: credit.montant_mensualite.toString(),
          firstPaymentDate: new Date(credit.date_premiere_mensualite),
          monthsCount: (
            (new Date(credit.date_derniere_mensualite).getTime() -
              new Date(credit.date_premiere_mensualite).getTime()) /
            (1000 * 60 * 60 * 24 * 30.5)
          ).toFixed(0),
          associate_with_vehicle: !!credit.vehicle_id,
          vehicle_id: credit.vehicle_id || null,
          vehicle_expense_type: credit.vehicle_expense_type || null,
          auto_generate_vehicle_expense: credit.auto_generate_vehicle_expense || false,
        }
      : {
          name: "",
          domain: "",
          amount: "",
          firstPaymentDate: new Date(),
          monthsCount: "",
          associate_with_vehicle: false,
          vehicle_id: null,
          vehicle_expense_type: null,
          auto_generate_vehicle_expense: false,
        },
  });

  // Mutation pour l'ajout ou la mise à jour d'un crédit
  const { mutate: submitCredit, isPending } = useMutation({
    mutationFn: async (values: CreditFormValues) => {
      const amount = parseFloat(values.amount);
      const monthsCount = parseInt(values.monthsCount, 10);
      const lastPaymentDate = addMonths(values.firstPaymentDate, monthsCount);

      // Données à sauvegarder dans la base de données
      const creditData = {
        nom_credit: values.name,
        nom_domaine: values.domain,
        montant_mensualite: amount,
        date_premiere_mensualite: values.firstPaymentDate.toISOString().split("T")[0],
        date_derniere_mensualite: lastPaymentDate.toISOString().split("T")[0],
        // Nouveaux champs pour l'association avec un véhicule
        vehicle_id: values.associate_with_vehicle ? values.vehicle_id : null,
        vehicle_expense_type: values.associate_with_vehicle ? values.vehicle_expense_type : null,
        auto_generate_vehicle_expense: 
          values.associate_with_vehicle && 
          values.vehicle_id && 
          values.vehicle_expense_type && 
          values.auto_generate_vehicle_expense
          ? true 
          : false,
      };

      if (credit) {
        // Mise à jour d'un crédit existant
        const { data, error } = await supabase
          .from("credits")
          .update(creditData)
          .eq("id", credit.id);

        if (error) throw error;
        return data;
      } else {
        // Ajout d'un nouveau crédit
        const { data, error } = await supabase
          .from("credits")
          .insert([creditData]);

        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      toast.success(
        credit
          ? "Le crédit a été mis à jour avec succès"
          : "Le crédit a été ajouté avec succès"
      );
      onSuccess();
    },
    onError: (error) => {
      console.error("Erreur:", error);
      toast.error(
        `Une erreur est survenue: ${
          error instanceof Error ? error.message : "Erreur inconnue"
        }`
      );
    },
  });

  // Gestion de la soumission du formulaire
  const onSubmit = (values: CreditFormValues) => {
    submitCredit(values);
  };

  return {
    form,
    onSubmit,
    isPending,
  };
};
