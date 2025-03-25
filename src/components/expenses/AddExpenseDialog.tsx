
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ExpenseForm } from "./ExpenseForm";
import { AddExpenseDialogProps } from "./types";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { AddExpenseDialogContent } from "./AddExpenseDialogContent";

export function AddExpenseDialog({ 
  onExpenseAdded, 
  preSelectedRetailer, 
  open, 
  onOpenChange,
  hideDialogWrapper = false 
}: AddExpenseDialogProps & { hideDialogWrapper?: boolean }) {
  // Détection des appareils mobiles
  const isMobile = useMediaQuery("(max-width: 639px)");
  
  // Si hideDialogWrapper est vrai, on n'affiche pas le Dialog wrapper
  if (hideDialogWrapper) {
    return (
      <ExpenseForm 
        onExpenseAdded={onExpenseAdded} 
        preSelectedRetailer={preSelectedRetailer} 
      />
    );
  }
  
  // Ajuster la largeur de la boîte de dialogue en fonction du type d'appareil
  const getDialogWidth = () => {
    if (isMobile) return "w-[95%] max-w-[95%]";
    return "sm:max-w-[500px] w-full";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className={cn(
          getDialogWidth(),
          "p-0 shadow-lg rounded-lg border-0 overflow-hidden",
          "bg-transparent", // Transparent pour permettre au gradient d'être visible
          "dark:bg-transparent"
        )}
      >
        <AddExpenseDialogContent 
          preSelectedRetailer={preSelectedRetailer}
          onExpenseAdded={onExpenseAdded}
          onCancel={() => onOpenChange?.(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
