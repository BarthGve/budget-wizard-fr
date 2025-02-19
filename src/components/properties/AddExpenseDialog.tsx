
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Form } from "@/components/ui/form";
import { Dispatch, SetStateAction } from "react";
import { ExpenseFormFields } from "./expenses/ExpenseFormFields";
import { useExpenseForm } from "./expenses/useExpenseForm";

interface AddExpenseDialogProps {
  propertyId: string;
  onExpenseAdded: () => void;
  expense?: any;
  open?: boolean;
  onOpenChange?: Dispatch<SetStateAction<boolean>>;
}

export function AddExpenseDialog({ propertyId, onExpenseAdded, expense, open, onOpenChange }: AddExpenseDialogProps) {
  const { form, onSubmit } = useExpenseForm({
    propertyId,
    expense,
    onSuccess: onExpenseAdded,
    onClose: () => {
      if (onOpenChange) {
        onOpenChange(false);
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-md">
          <Plus className="mr-2 h-4 w-4" /> Ajouter une dépense
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{expense ? "Modifier la dépense" : "Ajouter une dépense"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <ExpenseFormFields form={form} />
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
