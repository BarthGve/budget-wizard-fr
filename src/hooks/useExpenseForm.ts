
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useVehicleExpenses } from "@/hooks/useVehicleExpenses";

// Schéma de validation pour le formulaire
export const expenseFormSchema = z.object({
  expense_type: z.string().min(1, "Le type de dépense est requis"),
  date: z.string().min(1, "La date est requise"),
  amount: z.coerce.number().min(0.01, "Le montant doit être supérieur à 0"),
  fuel_volume: z.coerce.number().optional(),
  mileage: z.coerce.number().optional(),
  comment: z.string().optional()
});

export type ExpenseFormValues = z.infer<typeof expenseFormSchema>;

export interface ExpenseInitialValues {
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
}

interface UseExpenseFormProps {
  vehicleId: string;
  isEditMode?: boolean;
  expenseId?: string;
  initialValues?: ExpenseInitialValues;
  onSuccess?: () => void;
}

export const useExpenseForm = ({
  vehicleId,
  isEditMode = false,
  expenseId,
  initialValues,
  onSuccess
}: UseExpenseFormProps) => {
  const { addExpense, updateExpense, isAdding, isUpdating } = useVehicleExpenses(vehicleId);
  
  // Valeurs par défaut du formulaire
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

  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues
  });

  const onSubmit = (data: ExpenseFormValues) => {
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
          form.reset();
        }
      });
    } else {
      // Ajout d'une nouvelle dépense
      addExpense(expenseData, {
        onSuccess: () => {
          if (onSuccess) onSuccess();
          form.reset();
        }
      });
    }
  };

  // Détermine si l'opération est en cours (ajout ou mise à jour)
  const isLoading = isEditMode ? isUpdating : isAdding;
  
  return {
    form,
    onSubmit,
    isLoading,
    isEditMode
  };
};
