
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
  trigger: React.ReactNode;
}

export function RecurringExpenseDialog({ expense, trigger }: RecurringExpenseDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {expense ? "Modifier la charge récurrente" : "Ajouter une charge récurrente"}
          </DialogTitle>
        </DialogHeader>
        <RecurringExpenseForm
          expense={expense}
          onSuccess={() => setOpen(false)}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
