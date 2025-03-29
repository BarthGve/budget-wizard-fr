
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ExpenseForm } from "./ExpenseForm";
import { AddExpenseDialogProps } from "./types";
import { Receipt } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

export function AddExpenseDialog({ 
  onExpenseAdded, 
  preSelectedRetailer, 
  open, 
  onOpenChange,
  hideDialogWrapper = false
}: AddExpenseDialogProps & { 
  hideDialogWrapper?: boolean
}) {
  const isMobile = useIsMobile();
  
  // Contenu du dialogue simplifié
  const dialogContent = (
    <div className={cn(
      "relative flex flex-col",
      isMobile ? "p-4" : "pb-6 p-6",
      "bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800",
      "rounded-lg"
    )}>
      {/* Icône décorative en filigrane */}
      <div className="absolute bottom-0 right-0 w-24 h-24 pointer-events-none opacity-[0.05]">
        <Receipt className="w-full h-full" />
      </div>
      
      <div className="relative z-10">
        <ExpenseForm 
          onExpenseAdded={onExpenseAdded} 
          preSelectedRetailer={preSelectedRetailer}
          renderCustomActions={(isSubmitting) => (
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium",
                  "bg-transparent border border-gray-300 text-gray-700",
                  "dark:border-gray-600 dark:text-gray-300",
                  "hover:bg-gray-100 dark:hover:bg-gray-800",
                  "transition-colors"
                )}
                onClick={() => onOpenChange?.(false)}
              >
                Annuler
              </button>
              <button
                type="submit"
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium",
                  "bg-blue-600 text-white",
                  "dark:bg-blue-700",
                  "hover:bg-blue-700 dark:hover:bg-blue-600",
                  "transition-colors",
                  "shadow-sm"
                )}
                disabled={isSubmitting}
              >
                {isSubmitting ? "..." : "Ajouter"}
              </button>
            </div>
          )}
        />
      </div>
    </div>
  );

  // Si hideDialogWrapper est vrai, renvoyer uniquement le contenu
  if (hideDialogWrapper) {
    return dialogContent;
  }

  // Version mobile avec Sheet
  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent 
          side="bottom" 
          className="px-0 py-0 rounded-t-xl max-h-[90vh] overflow-y-auto"
        >
          <div className="absolute inset-x-0 top-0 h-1 w-12 mx-auto my-2 bg-gray-300 dark:bg-gray-600 rounded-full" />
          {dialogContent}
        </SheetContent>
      </Sheet>
    );
  }

  // Version desktop avec Dialog
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] p-0">
        {dialogContent}
      </DialogContent>
    </Dialog>
  );
}
