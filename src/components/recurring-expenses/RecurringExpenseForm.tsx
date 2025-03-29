
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
  
  const { form, handleSubmit } = useRecurringExpenseForm({
    expense,
    initialDomain,
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

  return (
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

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel} className="border-gray-300 hover:border-gray-400">
            Annuler
          </Button>
          <Button 
            type="submit" 
            className="bg-blue-600 hover:bg-blue-500 rounded-lg px-[16px] py-0 my-0 text-white"
          >
            {expense?.id ? "Mettre à jour" : "Ajouter"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
