
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRecurringExpenseForm } from "./hooks/useRecurringExpenseForm";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

interface RecurringExpenseFormProps {
  expense?: {
    id: string;
    name: string;
    amount: number;
    category: string;
    periodicity: "monthly" | "quarterly" | "yearly";
    debit_day: number;
    debit_month: number | null;
  };
  onSuccess: () => void;
  onCancel: () => void;
}

const periodicityOptions = [
  { value: "monthly", label: "Mensuelle" },
  { value: "quarterly", label: "Trimestrielle" },
  { value: "yearly", label: "Annuelle" }
];

const monthOptions = Array.from({ length: 12 }, (_, i) => ({
  value: (i + 1).toString(),
  label: new Date(0, i).toLocaleString('fr-FR', { month: 'long' })
}));

export function RecurringExpenseForm({
  expense,
  onSuccess,
  onCancel,
}: RecurringExpenseFormProps) {
  const { form, onSubmit } = useRecurringExpenseForm({
    expense,
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
      if (name === "periodicity") {
        const periodicity = value.periodicity;
        if (periodicity === "monthly") {
          form.setValue("debit_month", "");
        } else if (!value.debit_month) {
          form.setValue("debit_month", "1");
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Loyer" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Montant (€)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Ex: 1200"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Catégorie</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une catégorie" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories?.map(category => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="periodicity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Périodicité</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez la périodicité" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {periodicityOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="debit_day"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jour du prélèvement</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="1"
                  max="31"
                  placeholder="Ex: 15"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.watch("periodicity") !== "monthly" && (
          <FormField
            control={form.control}
            name="debit_month"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mois du prélèvement</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez le mois" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {monthOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit" className="bg-violet-600 hover:bg-violet-500 rounded-lg px-[16px] py-0 my-0 text-white">
            {expense ? "Mettre à jour" : "Ajouter"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
