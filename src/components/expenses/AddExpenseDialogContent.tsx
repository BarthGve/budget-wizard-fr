
import React from "react";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ExpenseForm } from "./ExpenseForm";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExpenseFormData } from "./types";

interface AddExpenseDialogContentProps {
  onSubmit?: (values: ExpenseFormData) => Promise<void>;
  preSelectedRetailer?: {
    id: string;
    name: string;
  } | null;
  onExpenseAdded?: () => void;
  onCancel?: () => void;
}

export function AddExpenseDialogContent({
  onSubmit,
  preSelectedRetailer,
  onExpenseAdded,
  onCancel
}: AddExpenseDialogContentProps) {
  return (
    <div className="relative flex flex-col pb-6 overflow-hidden">
      {/* Arrière-plan dégradé */}
      <div className={cn(
        "absolute inset-0 pointer-events-none bg-gradient-to-br",
        "from-blue-900 via-blue-800 to-blue-950",
        "opacity-100"
      )} />
      
      {/* Pattern subtle en overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-400 via-blue-300 to-transparent opacity-[0.03]" />
      
      <DialogHeader className="relative z-10 px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300">
            <Plus size={22} />
          </div>
          <div>
            <DialogTitle className="text-xl sm:text-2xl font-bold text-white">
              Ajouter une dépense
            </DialogTitle>
            <DialogDescription className="mt-1.5 text-base text-blue-100/80">
              Ajoutez une nouvelle dépense pour{preSelectedRetailer ? ` ${preSelectedRetailer.name}` : ""}
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>
      
      <div className="relative z-10 px-6 space-y-4">
        <ExpenseForm 
          onSubmit={onSubmit}
          preSelectedRetailer={preSelectedRetailer}
          onExpenseAdded={onExpenseAdded}
          buttonClassName="mb-4 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500"
          disableRetailerSelect={!!preSelectedRetailer}
          submitLabel="Ajouter"
          renderCustomActions={onCancel ? (
            <div className="flex justify-end gap-3 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="text-white border-blue-400/30 hover:bg-blue-800/50 hover:text-white"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500"
              >
                Ajouter
              </Button>
            </div>
          ) : undefined}
        />
      </div>
    </div>
  );
}
