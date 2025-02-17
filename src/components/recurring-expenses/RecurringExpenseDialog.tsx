
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { RecurringExpenseForm } from "./RecurringExpenseForm";

interface RecurringExpenseDialogProps {
  expense?: {
    id: string;
    name: string;
    amount: number;
    category: string;
    periodicity: "monthly" | "quarterly" | "yearly";
    debit_day: number;
    debit_month: number | null;
  };
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function RecurringExpenseDialog({ 
  expense, 
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange 
}: RecurringExpenseDialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const onOpenChange = isControlled ? controlledOnOpenChange : setUncontrolledOpen;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {expense ? "Modifier la charge récurrente" : "Ajouter une charge récurrente"}
          </DialogTitle>
          <DialogDescription>
            {expense 
              ? "Modifiez les informations de votre charge récurrente. Les modifications seront appliquées immédiatement."
              : "Ajoutez une nouvelle charge récurrente en remplissant les informations ci-dessous. Un logo sera automatiquement ajouté si disponible."}
          </DialogDescription>
        </DialogHeader>
        <RecurringExpenseForm
          expense={expense}
          onSuccess={() => onOpenChange?.(false)}
          onCancel={() => onOpenChange?.(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
