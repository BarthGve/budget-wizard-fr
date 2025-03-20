
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
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  isEditMode?: boolean;
  expenseId?: string;
  initialValues?: {
    vehicleId: string;
    expenseType: string;
    date: string;
    amount: string;
    mileage: string;
    fuelCompanyId?: string;
    fuelVolume: string;
    maintenanceType: string;
    repairType: string;
    comment: string;
  };
  onSuccess?: () => void;
  hideDialogWrapper?: boolean;
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
  amount: z.coerce.number().min(0.01, "Le montant doit être supérieur à 0"),
  fuel_volume: z.coerce.number().optional(),
  mileage: z.coerce.number().optional(),
  comment: z.string().optional()
});

type FormValues = z.infer<typeof formSchema>;

export const AddVehicleExpenseDialog = ({ 
  vehicleId, 
  open, 
  onOpenChange,
  isEditMode = false,
  expenseId,
  initialValues,
  onSuccess,
  hideDialogWrapper = false
}: AddVehicleExpenseDialogProps) => {
  const { addExpense, updateExpense, isAdding, isUpdating } = useVehicleExpenses(vehicleId);
  
  const defaultValues = initialValues ? {
    expense_type: initialValues.expenseType,
    date: initialValues.date,
    amount: parseFloat(initialValues.amount),
    fuel_volume: initialValues.fuelVolume ? parseFloat(initialValues.fuelVolume) : undefined,
    mileage: initialValues.mileage ? parseFloat(initialValues.mileage) : undefined,
    comment: initialValues.comment
  } : {
    expense_type: '',
    date: new Date().toISOString().split('T')[0],
    amount: 0,
    fuel_volume: undefined,
    mileage: undefined,
    comment: ''
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = (data: FormValues) => {
    const expenseData = {
      vehicle_id: vehicleId,
      expense_type: data.expense_type,
      date: data.date,
      amount: data.amount,
      fuel_volume: data.fuel_volume,
      mileage: data.mileage,
      comment: data.comment || null
    };

    if (isEditMode && expenseId) {
      // Mise à jour d'une dépense existante
      updateExpense({ id: expenseId, ...expenseData }, {
        onSuccess: () => {
          if (onSuccess) onSuccess();
          if (onOpenChange) onOpenChange(false);
          form.reset();
        }
      });
    } else {
      // Ajout d'une nouvelle dépense
      addExpense(expenseData, {
        onSuccess: () => {
          if (onSuccess) onSuccess();
          if (onOpenChange) onOpenChange(false);
          form.reset();
        }
      });
    }
  };

  // Détermine si l'opération est en cours (ajout ou mise à jour)
  const isLoading = isEditMode ? isUpdating : isAdding;
  
  // Si hideDialogWrapper est true, on affiche uniquement le contenu du formulaire sans le wrapper Dialog
  const formContent = (
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
                    onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
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
                    value={field.value === undefined ? '' : field.value}
                    onChange={(e) => field.onChange(e.target.value === '' ? undefined : e.target.valueAsNumber)}
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
                    value={field.value === undefined ? '' : field.value}
                    onChange={(e) => field.onChange(e.target.value === '' ? undefined : e.target.valueAsNumber)}
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
            onClick={() => onOpenChange && onOpenChange(false)}
          >
            Annuler
          </Button>
          <Button 
            type="submit" 
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditMode ? 'Mettre à jour' : 'Ajouter'} la dépense
          </Button>
        </div>
      </form>
    </Form>
  );

  // Si hideDialogWrapper est true, on retourne uniquement le contenu du formulaire
  if (hideDialogWrapper) {
    return formContent;
  }

  // Sinon, on enveloppe le formulaire dans un dialogue
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Modifier' : 'Ajouter'} une dépense</DialogTitle>
        </DialogHeader>
        {formContent}
      </DialogContent>
    </Dialog>
  );
};
