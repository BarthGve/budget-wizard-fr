
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";

interface ExpenseTypeFieldProps {
  form: UseFormReturn<any>;
  expenseTypes: {
    id: string;
    name: string;
    category: string;
  }[];
}

export function ExpenseTypeField({ form, expenseTypes }: ExpenseTypeFieldProps) {
  // Pour afficher les types de dépenses par catégories
  const categories = [...new Set(expenseTypes.map(type => type.category))];

  return (
    <FormField
      control={form.control}
      name="vehicle_expense_type"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Type de dépense véhicule</FormLabel>
          <Select
            value={field.value || ""}
            onValueChange={field.onChange}
            disabled={!form.watch("vehicle_id")}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un type de dépense" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {expenseTypes.length === 0 ? (
                <SelectItem value="" disabled>
                  Aucun type de dépense disponible
                </SelectItem>
              ) : (
                categories.map(category => (
                  <div key={category}>
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                      {category}
                    </div>
                    {expenseTypes
                      .filter(type => type.category === category)
                      .map(type => (
                        <SelectItem key={type.id} value={type.name}>
                          {type.name}
                        </SelectItem>
                      ))}
                  </div>
                ))
              )}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
