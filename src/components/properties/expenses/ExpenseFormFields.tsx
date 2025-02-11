
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fr } from "date-fns/locale";
import { UseFormReturn } from "react-hook-form";

export const EXPENSE_CATEGORIES = [
  { value: "charges", label: "Charges" },
  { value: "impots", label: "Impôts" },
  { value: "travaux", label: "Travaux" },
  { value: "assurance", label: "Assurance" },
  { value: "autres", label: "Autres" },
];

interface ExpenseFormFieldsProps {
  form: UseFormReturn<{
    amount: string;
    category: string;
    description: string;
    date: Date;
  }>;
}

export function ExpenseFormFields({ form }: ExpenseFormFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="date"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Date</FormLabel>
            <Input
              type="date"
              className="w-full"
              value={field.value ? field.value.toISOString().split('T')[0] : ""}
              onChange={(e) => {
                const date = e.target.value ? new Date(e.target.value) : new Date();
                field.onChange(date);
              }}
            />
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
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {EXPENSE_CATEGORIES.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Input placeholder="Description de la dépense" {...field} />
            </FormControl>
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
              <Input type="number" step="0.01" placeholder="0.00" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
    </>
  );
}
