
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useCreditForm } from "./hooks/useCreditForm";
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

// Types de dépenses disponibles pour les véhicules
const expenseTypes = [
  { id: "carburant", name: "Carburant" },
  { id: "entretien", name: "Entretien" },
  { id: "assurance", name: "Assurance" },
  { id: "credit", name: "Crédit / Financement" },
  { id: "autres", name: "Autres charges" }
];

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
  const { form, onSubmit } = useCreditForm({
    credit,
    onSuccess
  });

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
      <form onSubmit={onSubmit} className="space-y-4 max-w-full overflow-x-hidden p-2">
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
