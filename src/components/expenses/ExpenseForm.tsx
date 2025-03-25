
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { useRetailers } from "@/components/settings/retailers/useRetailers";
import { ExpenseFormData } from "./types";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useExpenseForm } from "./useExpenseForm";
import { ReactNode } from "react";

interface ExpenseFormProps {
  onSubmit?: (values: ExpenseFormData) => Promise<void>;
  defaultValues?: Partial<ExpenseFormData>;
  preSelectedRetailer?: {
    id: string;
    name: string;
  };
  submitLabel?: string;
  disableRetailerSelect?: boolean;
  buttonClassName?: string;
  onExpenseAdded?: () => void;
  renderCustomActions?: ReactNode;
}

export function ExpenseForm({ 
  onSubmit, 
  defaultValues, 
  preSelectedRetailer, 
  submitLabel = "Ajouter", 
  disableRetailerSelect,
  buttonClassName,
  onExpenseAdded,
  renderCustomActions
}: ExpenseFormProps) {
  const { retailers } = useRetailers();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  
  const expenseFormHandler = onExpenseAdded ? useExpenseForm(onExpenseAdded) : null;
  
  const form = useForm<ExpenseFormData>({
    defaultValues: {
      retailerId: defaultValues?.retailerId || preSelectedRetailer?.id || "",
      amount: defaultValues?.amount || "",
      date: defaultValues?.date || format(new Date(), "yyyy-MM-dd"),
      comment: defaultValues?.comment || "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;
  
  const handleFormSubmit = async (values: ExpenseFormData) => {
    if (expenseFormHandler && onExpenseAdded) {
      await expenseFormHandler.handleSubmit(values);
    } else if (onSubmit) {
      await onSubmit(values);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="retailerId"
          rules={{ required: "L'enseigne est requise" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enseigne</FormLabel>
              {preSelectedRetailer || disableRetailerSelect ? (
                <Input
                  value={preSelectedRetailer?.name || retailers?.find(r => r.id === field.value)?.name || ""}
                  disabled
                  className="bg-muted text-muted-foreground"
                />
              ) : (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="border-gray-300 focus:border-gray-400 focus-visible:ring-gray-200">
                      <SelectValue placeholder="Sélectionnez une enseigne" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {retailers?.map((retailer) => (
                      <SelectItem key={retailer.id} value={retailer.id}>
                        {retailer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          rules={{ 
            required: "Le montant est requis",
            pattern: {
              value: /^\d+(\.\d{1,2})?$/,
              message: "Montant invalide"
            }
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Montant</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="0.00" {...field} className="border-gray-300 focus:border-gray-400 focus-visible:ring-gray-200" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          rules={{ required: "La date est requise" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  {...field}
                  max={format(new Date(), "yyyy-MM-dd")}
                  className="border-gray-300 focus:border-gray-400 focus-visible:ring-gray-200"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Commentaire (facultatif)</FormLabel>
              <FormControl>
                <Textarea placeholder="Ajouter un commentaire..." {...field} className="border-gray-300 focus:border-gray-400 focus-visible:ring-gray-200" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {renderCustomActions ? (
          renderCustomActions
        ) : (
          <Button 
            type="submit" 
            className={cn(
              "w-full mt-6",
              "bg-blue-500 hover:bg-blue-600 text-white",
              "dark:bg-blue-600 dark:hover:bg-blue-500",
              "transition-colors duration-200 shadow-sm",
              "focus-visible:ring-blue-500",
              isSubmitting && "opacity-80 cursor-not-allowed",
              buttonClassName
            )}
            style={{
              boxShadow: isDarkMode
                ? "0 2px 8px -2px rgba(37, 99, 235, 0.3)"
                : "0 2px 8px -2px rgba(37, 99, 235, 0.25)"
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? "En cours..." : submitLabel}
          </Button>
        )}
      </form>
    </Form>
  );
}
