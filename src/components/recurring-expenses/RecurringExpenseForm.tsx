import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRecurringExpenseForm } from "./hooks/useRecurringExpenseForm";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
interface RecurringExpenseFormProps {
  expense?: {
    id: string;
    name: string;
    amount: number;
    category: string;
  };
  onSuccess: () => void;
  onCancel: () => void;
  colorPalette?: string;
}
export function RecurringExpenseForm({
  expense,
  onSuccess,
  onCancel,
  colorPalette = "default"
}: RecurringExpenseFormProps) {
  const {
    form,
    onSubmit
  } = useRecurringExpenseForm({
    expense,
    onSuccess
  });
  const {
    data: categories
  } = useQuery({
    queryKey: ["recurring-expense-categories"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("recurring_expense_categories").select("*").order("name");
      if (error) throw error;
      return data;
    }
  });
  const paletteToBackground: Record<string, string> = {
    default: "bg-blue-500 hover:bg-blue-600",
    ocean: "bg-sky-500 hover:bg-sky-600",
    forest: "bg-green-500 hover:bg-green-600",
    sunset: "bg-orange-500 hover:bg-orange-600",
    candy: "bg-pink-400 hover:bg-pink-500"
  };
  return <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4">
        <FormField control={form.control} name="name" render={({
        field
      }) => <FormItem>
              <FormLabel>Nom</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Loyer" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>} />
        <FormField control={form.control} name="amount" render={({
        field
      }) => <FormItem>
              <FormLabel>Montant (€)</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="Ex: 1200" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>} />
        <FormField control={form.control} name="category" render={({
        field
      }) => <FormItem>
              <FormLabel>Catégorie</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une catégorie" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories?.map(category => <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>)}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>} />
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit" className="bg-violet-600 hover:bg-violet-500 rounded-lg px-[16px] py-0 my-0 text-white">
            {expense ? "Mettre à jour" : "Ajouter"}
          </Button>
        </div>
      </form>
    </Form>;
}