
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ExpenseForm } from "./ExpenseForm";
import { AddExpenseDialogProps } from "./types";
import { PlusCircle, Receipt } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRef } from "react";

export function AddExpenseDialog({ 
  onExpenseAdded, 
  preSelectedRetailer, 
  open, 
  onOpenChange,
  hideDialogWrapper = false,
  hideTitleBar = false,
  colorScheme = "blue" 
}: AddExpenseDialogProps & { 
  hideDialogWrapper?: boolean, 
  hideTitleBar?: boolean,
  colorScheme?: "blue" | "green" | "purple" 
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Couleurs dynamiques selon le colorScheme
  const colors = {
    blue: {
      gradientFrom: "from-blue-500",
      gradientTo: "to-indigo-400",
      darkGradientFrom: "dark:from-blue-600",
      darkGradientTo: "dark:to-indigo-500",
      iconBg: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
      headingText: "text-blue-900 dark:text-blue-200",
      descriptionText: "text-blue-700/80 dark:text-blue-300/80",
      buttonBg: "bg-blue-600 hover:bg-blue-500 dark:bg-blue-700 dark:hover:bg-blue-600",
      lightBg: "from-white via-blue-50/40 to-blue-100/70",
      darkBg: "dark:from-gray-900 dark:via-blue-950/20 dark:to-blue-900/30",
      borderLight: "border-blue-100/70",
      borderDark: "dark:border-blue-800/20",
    },
    green: {
      gradientFrom: "from-green-500",
      gradientTo: "to-emerald-400",
      darkGradientFrom: "dark:from-green-600",
      darkGradientTo: "dark:to-emerald-500",
      iconBg: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
      headingText: "text-green-900 dark:text-green-200",
      descriptionText: "text-green-700/80 dark:text-green-300/80",
      buttonBg: "bg-green-600 hover:bg-green-500 dark:bg-green-700 dark:hover:bg-green-600",
      lightBg: "from-white via-green-50/40 to-green-100/70",
      darkBg: "dark:from-gray-900 dark:via-green-950/20 dark:to-green-900/30",
      borderLight: "border-green-100/70", 
      borderDark: "dark:border-green-800/20",
    },
    purple: {
      gradientFrom: "from-purple-500",
      gradientTo: "to-violet-400",
      darkGradientFrom: "dark:from-purple-600",
      darkGradientTo: "dark:to-violet-500",
      iconBg: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
      headingText: "text-purple-900 dark:text-purple-200",
      descriptionText: "text-purple-700/80 dark:text-purple-300/80",
      buttonBg: "bg-purple-600 hover:bg-purple-500 dark:bg-purple-700 dark:hover:bg-purple-600",
      lightBg: "from-white via-purple-50/40 to-purple-100/70",
      darkBg: "dark:from-gray-900 dark:via-purple-950/20 dark:to-purple-900/30",
      borderLight: "border-purple-100/70", 
      borderDark: "dark:border-purple-800/20",
    },
  };
  
  const currentColors = colors[colorScheme];
  
  // Si hideDialogWrapper est vrai, on n'affiche pas le Dialog wrapper
  const dialogContent = (
    <div 
      ref={contentRef}
      className={cn(
        "relative flex flex-col pb-6 p-6 rounded-lg",
        "bg-gradient-to-br",
        currentColors.lightBg,
        currentColors.darkBg,
        // Dégradé bleu subtil sans gris
        "before:absolute before:inset-0 before:bg-gradient-to-br before:opacity-20 before:rounded-lg",
        "before:from-blue-300 before:to-blue-500",
        "dark:before:from-blue-700 dark:before:to-blue-900 dark:before:opacity-30",
        "overflow-hidden border-0"
      )}
    >
      {/* Overlay pour le dégradé bleu principal - suppression des tons gris */}
      <div className={cn(
        "absolute inset-0 pointer-events-none opacity-10 bg-gradient-to-br rounded-lg",
        "from-blue-300 to-blue-600",
        "dark:from-blue-600 dark:to-blue-900 dark:opacity-20"
      )} />

      {/* Remplacer l'effet radial gris par un effet bleu subtil */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100 via-blue-50 to-transparent opacity-[0.02] dark:from-blue-500 dark:via-blue-600 dark:to-transparent dark:opacity-[0.01] rounded-lg" />
      
      {!hideTitleBar && (
        <DialogHeader className="relative z-10 mb-4">
          <div className="flex items-center gap-3">
            <div className={cn("p-2.5 rounded-lg", currentColors.iconBg)}>
              <PlusCircle className="w-5 h-5" />
            </div>
            <DialogTitle className={cn("text-2xl font-bold", currentColors.headingText)}>
              Ajouter une dépense
            </DialogTitle>
          </div>
          <div className="ml-[52px] mt-2">
            <DialogDescription className={cn("text-base", currentColors.descriptionText)}>
              Ajoutez une nouvelle dépense à votre historique financier.
            </DialogDescription>
          </div>
        </DialogHeader>
      )}

      <div className="relative z-10 px-1">
        <ExpenseForm 
          onExpenseAdded={onExpenseAdded} 
          preSelectedRetailer={preSelectedRetailer}
        />
      </div>

      <div className="absolute bottom-0 right-0 w-32 h-32 pointer-events-none opacity-[0.03] dark:opacity-[0.02]">
        <Receipt className="w-full h-full" />
      </div>
    </div>
  );

  if (hideDialogWrapper) {
    return dialogContent;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px] p-0 border-0 overflow-hidden bg-transparent shadow-2xl">
        {dialogContent}
      </DialogContent>
    </Dialog>
  );
}
