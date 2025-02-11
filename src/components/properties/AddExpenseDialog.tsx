
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Dispatch, SetStateAction, useEffect } from "react";

interface AddExpenseDialogProps {
  propertyId: string;
  onExpenseAdded: () => void;
  expense?: any;
  open?: boolean;
  onOpenChange?: Dispatch<SetStateAction<boolean>>;
}

const EXPENSE_CATEGORIES = [
  { value: "charges", label: "Charges" },
  { value: "impots", label: "Impôts" },
  { value: "travaux", label: "Travaux" },
  { value: "assurance", label: "Assurance" },
  { value: "autres", label: "Autres" },
];

export function AddExpenseDialog({ propertyId, onExpenseAdded, expense, open, onOpenChange }: AddExpenseDialogProps) {
  const { toast } = useToast();
  const form = useForm({
    defaultValues: {
      amount: "",
      category: "",
      description: "",
      date: new Date(),
    },
  });

  useEffect(() => {
    if (expense) {
      form.reset({
        amount: expense.amount.toString(),
        category: expense.category,
        description: expense.description,
        date: new Date(expense.date),
      });
    }
  }, [expense, form]);

  const onSubmit = async (values: any) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour ajouter une dépense",
          variant: "destructive",
        });
        return;
      }

      let error;
      if (expense) {
        // Update existing expense
        ({ error } = await supabase
          .from("property_expenses")
          .update({
            amount: Number(values.amount),
            category: values.category,
            description: values.description,
            date: format(values.date, "yyyy-MM-dd"),
          })
          .eq('id', expense.id));
      } else {
        // Create new expense
        ({ error } = await supabase
          .from("property_expenses")
          .insert({
            property_id: propertyId,
            profile_id: session.session.user.id,
            amount: Number(values.amount),
            category: values.category,
            description: values.description,
            date: format(values.date, "yyyy-MM-dd"),
          }));
      }

      if (error) throw error;

      toast({
        title: "Succès",
        description: expense ? "La dépense a été modifiée" : "La dépense a été ajoutée",
      });

      if (onOpenChange) {
        onOpenChange(false);
      }
      form.reset();
      onExpenseAdded();
    } catch (error) {
      console.error("Error adding/updating expense:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter/modifier la dépense",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Ajouter une dépense
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{expense ? "Modifier la dépense" : "Ajouter une dépense"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "d MMMM yyyy", { locale: fr })
                          ) : (
                            <span>Choisir une date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
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
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (onOpenChange) {
                    onOpenChange(false);
                  }
                  form.reset();
                }}
              >
                Annuler
              </Button>
              <Button type="submit">{expense ? "Modifier" : "Ajouter"}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
