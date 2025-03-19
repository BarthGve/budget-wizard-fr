
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useVehicleExpenses } from "@/hooks/useVehicleExpenses";
import { Loader2 } from "lucide-react";

interface AddVehicleExpenseDialogProps {
  vehicleId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const expenseTypes = [
  { value: "carburant", label: "Carburant" },
  { value: "entretien", label: "Entretien" },
  { value: "reparation", label: "Réparation" },
  { value: "assurance", label: "Assurance" },
  { value: "amende", label: "Amende" },
  { value: "parking", label: "Parking" },
  { value: "peage", label: "Péage" },
  { value: "autre", label: "Autre" }
];

const formSchema = z.object({
  expense_type: z.string().min(1, "Le type de dépense est requis"),
  date: z.string().min(1, "La date est requise"),
  amount: z.string().min(1, "Le montant est requis").transform(val => Number(val)),
  fuel_volume: z.string().optional().transform(val => val ? Number(val) : undefined),
  mileage: z.string().optional().transform(val => val ? Number(val) : undefined),
  comment: z.string().optional()
});

type FormValues = z.infer<typeof formSchema>;

export const AddVehicleExpenseDialog = ({ vehicleId, open, onOpenChange }: AddVehicleExpenseDialogProps) => {
  const { addExpense, isAdding } = useVehicleExpenses(vehicleId);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      expense_type: '',
      date: new Date().toISOString().split('T')[0],
      amount: '',
      fuel_volume: '',
      mileage: '',
      comment: ''
    }
  });

  const onSubmit = (data: FormValues) => {
    const expenseData = {
      vehicle_id: vehicleId,
      expense_type: data.expense_type,
      date: data.date,
      amount: data.amount,
      fuel_volume: data.fuel_volume ? data.fuel_volume : undefined,
      mileage: data.mileage ? data.mileage : undefined,
      comment: data.comment || null
    };

    addExpense(expenseData, {
      onSuccess: () => {
        onOpenChange(false);
        form.reset();
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Ajouter une dépense</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="expense_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type de dépense</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un type de dépense" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {expenseTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
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
                        placeholder="0.00" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fuel_volume"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Volume carburant (L)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01"
                        placeholder="Optionnel" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mileage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kilométrage</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Optionnel" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Commentaire</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Optionnel" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Annuler
              </Button>
              <Button 
                type="submit" 
                disabled={isAdding}
              >
                {isAdding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Ajouter la dépense
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
