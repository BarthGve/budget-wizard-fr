
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useRecurringExpenseForm } from "./hooks/useRecurringExpenseForm";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { NameField } from "./form-fields/NameField";
import { AmountField } from "./form-fields/AmountField";
import { CategoryField } from "./form-fields/CategoryField";
import { PeriodicityField } from "./form-fields/PeriodicityField";
import { DebitDayField } from "./form-fields/DebitDayField";
import { DebitMonthField } from "./form-fields/DebitMonthField";
import { DomainField } from "./form-fields/DomainField";
import { VehicleField } from "./form-fields/VehicleField";
import { ExpenseTypeField } from "./form-fields/ExpenseTypeField";
import { AutoGenerateField } from "./form-fields/AutoGenerateField";
import { expenseTypes } from "@/components/vehicles/expenses/form/ExpenseTypeField";

export interface RecurringExpenseFormProps {
  expense?: {
    id: string;
    name: string;
    amount: number;
    category: string;
    periodicity: "monthly" | "quarterly" | "yearly";
    debit_day: number;
    debit_month: number | null;
    logo_url?: string;
    notes?: string;
    vehicle_id?: string | null;
    vehicle_expense_type?: string | null;
    auto_generate_vehicle_expense?: boolean;
  };
  onSuccess: () => void;
  onCancel: () => void;
  variant?: string;
  initialVehicleId?: string;
}

const extractDomainFromLogoUrl = (logoUrl?: string) => {
  if (!logoUrl || logoUrl === "/placeholder.svg") return "";
  try {
    const domain = logoUrl.replace("https://logo.clearbit.com/", "");
    return domain;
  } catch {
    return "";
  }
};

export function RecurringExpenseForm({
  expense,
  onSuccess,
  onCancel,
  variant,
  initialVehicleId,
}: RecurringExpenseFormProps) {
  const initialDomain = extractDomainFromLogoUrl(expense?.logo_url);
  
  const { form, handleSubmit } = useRecurringExpenseForm({
    expense,
    initialDomain,
    initialVehicleId,
    onSuccess
  });

  const { data: categories } = useQuery({
    queryKey: ["recurring-expense-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("recurring_expense_categories")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    }
  });

  // Convertir les types de dépenses du format de ExpenseTypeField au format attendu
  const formattedExpenseTypes = expenseTypes.map(type => ({
    id: type.value,
    name: type.label
  }));

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      // Gestion de la périodicité
      if (name === "periodicity") {
        const periodicity = value.periodicity;
        if (periodicity === "monthly") {
          form.setValue("debit_month", null);
        } else if (!value.debit_month) {
          form.setValue("debit_month", "1");
        }
      }

      // Gestion des champs liés au véhicule
      if (name === "vehicle_id") {
        if (!value.vehicle_id) {
          // Réinitialiser les champs liés au véhicule
          form.setValue("vehicle_expense_type", null);
          form.setValue("auto_generate_vehicle_expense", false);
        }
      }
      
      // Désactiver l'option auto-generate si le type n'est pas spécifié
      if (name === "vehicle_expense_type") {
        if (!value.vehicle_expense_type || value.vehicle_expense_type === "no-type") {
          form.setValue("auto_generate_vehicle_expense", false);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  // Vérifie si un véhicule est sélectionné
  const vehicleSelected = !!form.watch("vehicle_id");

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <NameField form={form} />
        <DomainField form={form} />
        <AmountField form={form} />
        <CategoryField form={form} categories={categories || []} />
        
        {/* Champ pour sélectionner un véhicule */}
        <VehicleField form={form} />
        
        {/* Champs conditionnels qui s'affichent uniquement si un véhicule est sélectionné */}
        {vehicleSelected && (
          <>
            <ExpenseTypeField form={form} expenseTypes={formattedExpenseTypes} />
            <AutoGenerateField form={form} />
          </>
        )}
        
        <PeriodicityField form={form} />
        <DebitDayField form={form} />
        
        {form.watch("periodicity") !== "monthly" && (
          <DebitMonthField form={form} />
        )}

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel} className="border-gray-300 hover:border-gray-400">
            Annuler
          </Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-500 rounded-lg px-[16px] py-0 my-0 text-white">
            {expense ? "Mettre à jour" : "Ajouter"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
