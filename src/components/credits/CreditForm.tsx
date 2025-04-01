
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useCreditForm as useBaseCreditForm } from "./hooks/useCreditForm";
import { NameField } from "./form-fields/NameField";
import { DomainField } from "./form-fields/DomainField";
import { AmountField } from "./form-fields/AmountField";
import { FirstPaymentDateField } from "./form-fields/FirstPaymentDateField";
import { MonthsCountField } from "./form-fields/MonthsCountField";
import { AssociateVehicleField } from "./form-fields/AssociateVehicleField";
import { VehicleField } from "./form-fields/VehicleField";
import { ExpenseTypeField } from "./form-fields/ExpenseTypeField";
import { AutoGenerateField } from "./form-fields/AutoGenerateField";
import { Credit } from "./types";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { addMonths } from "date-fns";
import { toast } from "sonner";

// Types de dépenses disponibles pour les véhicules
const expenseTypes = [
  { id: "carburant", name: "Carburant" },
  { id: "entretien", name: "Entretien" },
  { id: "assurance", name: "Assurance" },
  { id: "credit", name: "Crédit / Financement" },
  { id: "autres", name: "Autres charges" }
];

// Schéma de validation étendu pour inclure les champs de véhicule
const creditFormSchema = z.object({
  name: z.string().min(1, "Le nom est obligatoire"),
  domain: z.string().min(1, "Le domaine est obligatoire"),
  amount: z.string().min(1, "Le montant est obligatoire"),
  firstPaymentDate: z.date(),
  monthsCount: z.string().min(1, "Le nombre de mensualités est obligatoire"),
  associate_with_vehicle: z.boolean().default(false),
  vehicle_id: z.string().nullable().optional(),
  vehicle_expense_type: z.string().nullable().optional(),
  auto_generate_vehicle_expense: z.boolean().default(false),
});

// Type pour les valeurs du formulaire
export type CreditFormValues = z.infer<typeof creditFormSchema>;

interface CreditFormProps {
  credit?: Credit;
  onSuccess: () => void;
  onCancel: () => void;
  colorScheme?: "purple" | "green" | "blue";
}

export function CreditForm({
  credit,
  onSuccess,
  onCancel,
  colorScheme = "purple",
}: CreditFormProps) {
  // Utilisation directe de useForm plutôt que useCreditForm
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

  // Effet pour gérer les dépendances des champs de véhicule
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      // Gestion de l'association avec un véhicule
      if (name === "associate_with_vehicle") {
        if (!value.associate_with_vehicle) {
          // Réinitialiser tous les champs liés au véhicule
          form.setValue("vehicle_id", null);
          form.setValue("vehicle_expense_type", null);
          form.setValue("auto_generate_vehicle_expense", false);
        }
      }
      
      // Gestion du changement de véhicule
      if (name === "vehicle_id") {
        if (!value.vehicle_id) {
          // Réinitialiser les champs spécifiques au véhicule
          form.setValue("vehicle_expense_type", null);
          form.setValue("auto_generate_vehicle_expense", false);
        }
      }
      
      // Gestion du changement de type d'expense
      if (name === "vehicle_expense_type") {
        if (!value.vehicle_expense_type) {
          // Désactiver l'auto-génération
          form.setValue("auto_generate_vehicle_expense", false);
        }
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form]);

  // Couleurs du bouton en fonction du colorScheme
  const buttonColors = {
    purple: "bg-violet-600 hover:bg-violet-500",
    green: "bg-green-600 hover:bg-green-500",
    blue: "bg-blue-600 hover:bg-blue-500"
  };

  // Vérifier si l'association avec un véhicule est activée
  const associateWithVehicle = form.watch("associate_with_vehicle");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-full overflow-x-hidden p-2">
        <NameField form={form} />
        <DomainField form={form} />
        <AmountField form={form} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FirstPaymentDateField form={form} />
          <MonthsCountField form={form} />
        </div>

        {/* Section association avec un véhicule */}
        <div className="pt-2 border-t">
          <AssociateVehicleField form={form} />
          
          {/* Champs conditionnels qui s'affichent uniquement si l'association est activée */}
          {associateWithVehicle && (
            <div className="mt-4 space-y-4">
              <VehicleField form={form} />
              
              {/* Champs supplémentaires qui s'affichent si un véhicule est sélectionné */}
              {form.watch("vehicle_id") && (
                <>
                  <ExpenseTypeField form={form} expenseTypes={expenseTypes} />
                  <AutoGenerateField form={form} />
                </>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel} className="border-gray-300 hover:border-gray-400">
            Annuler
          </Button>
          <Button type="submit" className={`${buttonColors[colorScheme]} rounded-lg px-[16px] py-0 my-0 text-white`}>
            {credit ? "Mettre à jour" : "Ajouter"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
