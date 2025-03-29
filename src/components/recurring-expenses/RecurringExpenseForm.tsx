
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useRecurringExpenseForm } from "./hooks/useRecurringExpenseForm";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
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
import { VehicleAssociationDialog } from "./dialogs/VehicleAssociationDialog";

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
  onSuccess: (data?: any) => void;
  onCancel: () => void;
  variant?: string;
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
}: RecurringExpenseFormProps) {
  const initialDomain = extractDomainFromLogoUrl(expense?.logo_url);
  
  // États pour gérer le dialogue d'association de véhicule
  const [showVehicleAssociationDialog, setShowVehicleAssociationDialog] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  
  const { form, handleSubmit, isSubmitting } = useRecurringExpenseForm({
    expense,
    initialDomain,
    onSuccess: (data) => {
      // Pour les nouvelles charges sans ID et sans véhicule déjà associé
      if (!expense?.id && !data.vehicle_id) {
        setFormData(data);
        setShowVehicleAssociationDialog(true);
      } else {
        onSuccess(data);
      }
    }
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
    });

    return () => subscription.unsubscribe();
  }, [form]);

  // Gestionnaire pour finaliser après association de véhicule
  const handleVehicleAssociationComplete = (data: any) => {
    setShowVehicleAssociationDialog(false);
    onSuccess(data);
  };

  // Déterminer si nous devons afficher les champs relatifs aux véhicules
  const showVehicleFields = !!expense?.vehicle_id || form.watch("vehicle_id");

  return (
    <>
      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <NameField form={form} />
          <DomainField form={form} />
          <AmountField form={form} />
          <CategoryField form={form} categories={categories || []} />
          <PeriodicityField form={form} />
          <DebitDayField form={form} />
          
          {form.watch("periodicity") !== "monthly" && (
            <DebitMonthField form={form} />
          )}

          {/* Afficher les champs de véhicule uniquement si approprié */}
          {showVehicleFields && (
            <>
              <VehicleField form={form} />
              <ExpenseTypeField form={form} />
              <AutoGenerateField form={form} />
            </>
          )}

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel} className="border-gray-300 hover:border-gray-400">
              Annuler
            </Button>
            <Button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-500 rounded-lg px-[16px] py-0 my-0 text-white"
              disabled={isSubmitting}
            >
              {expense?.id ? "Mettre à jour" : "Ajouter"}
            </Button>
          </div>
        </form>
      </Form>

      {/* Dialogue d'association de véhicule */}
      <VehicleAssociationDialog
        isOpen={showVehicleAssociationDialog}
        onClose={() => {
          setShowVehicleAssociationDialog(false);
          // En cas d'annulation, on envoie quand même les données originales
          onSuccess(formData);
        }}
        expenseData={formData}
        onComplete={handleVehicleAssociationComplete}
      />
    </>
  );
}
