
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useCreditForm } from "./hooks/useCreditForm";
import { NameField } from "./form-fields/NameField";
import { DomainField } from "./form-fields/DomainField";
import { AmountField } from "./form-fields/AmountField";
import { FirstPaymentDateField } from "./form-fields/FirstPaymentDateField";
import { MonthsCountField } from "./form-fields/MonthsCountField";
import { Credit } from "./types";
import { AssociateVehicleField } from "./form-fields/AssociateVehicleField";
import { VehicleField } from "./form-fields/VehicleField";
import { ExpenseTypeField } from "./form-fields/ExpenseTypeField";
import { AutoGenerateExpenseField } from "./form-fields/AutoGenerateExpenseField";

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
  
  // Regarder le champ associate_with_vehicle pour afficher les champs associés
  const associateWithVehicle = form.watch("associate_with_vehicle");
  const vehicleId = form.watch("vehicle_id");
  const vehicleExpenseType = form.watch("vehicle_expense_type");

  // Couleurs du bouton en fonction du colorScheme
  const buttonColors = {
    purple: "bg-violet-600 hover:bg-violet-500",
    green: "bg-green-600 hover:bg-green-500",
    blue: "bg-blue-600 hover:bg-blue-500"
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(data => onSubmit(data))} className="space-y-4 max-w-full overflow-x-hidden p-2">
        <NameField form={form} />
        <DomainField form={form} />
        <AmountField form={form} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FirstPaymentDateField form={form} />
          <MonthsCountField form={form} />
        </div>
        
        {/* Partie association véhicule */}
        <div className="mt-6 pt-4 border-t border-border">
          <AssociateVehicleField form={form} />
          
          {/* Afficher ces champs uniquement si l'association est activée */}
          {associateWithVehicle && (
            <div className="space-y-4 mt-4">
              <VehicleField form={form} />
              
              {vehicleId && (
                <>
                  <ExpenseTypeField form={form} />
                  
                  {/* Afficher le champ de génération auto si un type est sélectionné */}
                  {vehicleId && vehicleExpenseType && vehicleExpenseType !== "no-type" && (
                    <AutoGenerateExpenseField form={form} />
                  )}
                </>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2 mt-6">
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
