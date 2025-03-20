
import { Form } from "@/components/ui/form";
import { ExpenseTypeField } from "./ExpenseTypeField";
import { NumericFields } from "./NumericFields";
import { CommentField } from "./CommentField";
import { ExpenseFormActions } from "./ExpenseFormActions";
import { useExpenseForm, ExpenseFormValues, ExpenseInitialValues } from "@/hooks/useExpenseForm";

interface ExpenseFormProps {
  vehicleId: string;
  isEditMode?: boolean;
  expenseId?: string;
  initialValues?: ExpenseInitialValues;
  onSuccess?: () => void;
  onCancel: () => void;
}

export const ExpenseForm = ({ 
  vehicleId, 
  isEditMode = false, 
  expenseId,
  initialValues,
  onSuccess,
  onCancel
}: ExpenseFormProps) => {
  const { form, onSubmit, isLoading } = useExpenseForm({
    vehicleId,
    isEditMode,
    expenseId,
    initialValues,
    onSuccess: () => {
      if (onSuccess) {
        // Utiliser un timeout pour permettre à React de mettre à jour le DOM
        // avant que nous ne tentions de rafraîchir les données
        setTimeout(() => {
          onSuccess();
        }, 100);
      }
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <ExpenseTypeField control={form.control} />
        <NumericFields control={form.control} />
        <CommentField control={form.control} />
        <ExpenseFormActions 
          isLoading={isLoading} 
          isEditMode={isEditMode} 
          onCancel={onCancel}
        />
      </form>
    </Form>
  );
};
