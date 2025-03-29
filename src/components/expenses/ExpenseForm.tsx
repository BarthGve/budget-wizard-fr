
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { useRetailers } from "@/components/settings/retailers/useRetailers";
import { ExpenseFormData } from "./types";
import { cn } from "@/lib/utils";
import { useExpenseForm } from "./useExpenseForm";
import { useIsMobile } from "@/hooks/use-mobile";

interface ExpenseFormProps {
  onExpenseAdded?: () => void;
  preSelectedRetailer?: {
    id: string;
    name: string;
  };
  renderCustomActions?: (isSubmitting: boolean) => React.ReactNode;
  // Nouvelles propriétés pour supporter EditExpenseDialog
  onSubmit?: (formData: ExpenseFormData) => Promise<void>;
  defaultValues?: ExpenseFormData;
  submitLabel?: string;
  disableRetailerSelect?: boolean;
}

export function ExpenseForm({ 
  onExpenseAdded, 
  preSelectedRetailer,
  renderCustomActions,
  onSubmit: externalSubmit,
  defaultValues: externalDefaultValues,
  submitLabel = "Ajouter",
  disableRetailerSelect = false
}: ExpenseFormProps) {
  const { retailers } = useRetailers();
  const isMobile = useIsMobile();
  const expenseFormHandler = onExpenseAdded ? useExpenseForm(onExpenseAdded) : null;
  
  const form = useForm<ExpenseFormData>({
    defaultValues: externalDefaultValues || {
      retailerId: preSelectedRetailer?.id || "",
      amount: "",
      date: format(new Date(), "yyyy-MM-dd"),
      comment: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;
  
  const handleFormSubmit = async (values: ExpenseFormData) => {
    if (externalSubmit) {
      await externalSubmit(values);
    } else if (expenseFormHandler && onExpenseAdded) {
      await expenseFormHandler.handleSubmit(values);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className={cn("space-y-4", isMobile && "space-y-3")}>
        {/* Enseigne */}
        <FormField
          control={form.control}
          name="retailerId"
          rules={{ required: "L'enseigne est requise" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel className={cn(
                "text-gray-700 dark:text-gray-300",
                isMobile ? "text-xs" : "text-sm"
              )}>Enseigne</FormLabel>
              {preSelectedRetailer || disableRetailerSelect ? (
                <Input
                  value={preSelectedRetailer?.name || (retailers?.find(r => r.id === field.value)?.name || "")}
                  disabled
                  className="bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-800/50 dark:text-gray-300 dark:border-gray-700"
                />
              ) : (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className={cn(
                      "border-gray-300 dark:border-gray-700",
                      isMobile && "h-9 text-sm"
                    )}>
                      <SelectValue placeholder="Sélectionnez une enseigne" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {retailers?.map((retailer) => (
                      <SelectItem key={retailer.id} value={retailer.id} className={isMobile && "text-sm"}>
                        {retailer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </FormItem>
          )}
        />
        
        {/* Montant */}
        <FormField
          control={form.control}
          name="amount"
          rules={{ required: "Le montant est requis" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel className={cn(
                "text-gray-700 dark:text-gray-300",
                isMobile ? "text-xs" : "text-sm"
              )}>Montant</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input 
                    type="number" 
                    step="0.01" 
                    placeholder="0.00" 
                    {...field} 
                    className={cn(
                      "pr-6",
                      isMobile && "h-9 text-sm"
                    )} 
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">€</span>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        
        {/* Date */}
        <FormField
          control={form.control}
          name="date"
          rules={{ required: "La date est requise" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel className={cn(
                "text-gray-700 dark:text-gray-300",
                isMobile ? "text-xs" : "text-sm"
              )}>Date</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  {...field}
                  max={format(new Date(), "yyyy-MM-dd")}
                  className={isMobile && "h-9 text-sm"}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        {/* Commentaire - Ajoutée si nécessaire */}
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={cn(
                "text-gray-700 dark:text-gray-300",
                isMobile ? "text-xs" : "text-sm"
              )}>Commentaire</FormLabel>
              <FormControl>
                <Input
                  placeholder="Commentaire (optionnel)"
                  {...field}
                  className={isMobile && "h-9 text-sm"}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        {renderCustomActions ? (
          renderCustomActions(isSubmitting)
        ) : (
          <button 
            type="submit" 
            className={cn(
              "w-full py-2 rounded-md font-medium",
              "bg-blue-600 hover:bg-blue-700 text-white",
              "dark:bg-blue-700 dark:hover:bg-blue-600",
              "transition-colors shadow-sm",
              isMobile ? "text-sm" : "text-base"
            )}
            disabled={isSubmitting}
          >
            {isSubmitting ? "En cours..." : submitLabel}
          </button>
        )}
      </form>
    </Form>
  );
}
