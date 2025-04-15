import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ExpenseForm } from "./ExpenseForm";
import { AddExpenseDialogProps } from "./types";
import { PlusCircle, Receipt } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRef } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export function AddExpenseDialog({ 
  onExpenseAdded, 
  preSelectedRetailer, 
  open, 
  onOpenChange,
  hideDialogWrapper = false,
  hideTitleBar = false
}: AddExpenseDialogProps & { 
  hideDialogWrapper?: boolean, 
  hideTitleBar?: boolean
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  // Contenu du dialogue commun aux deux versions
  const dialogContent = (
    <div 
      ref={contentRef}
      className={cn(
        "relative flex flex-col pb-6 p-6 rounded-lg border",
        "bg-gradient-to-br",
        "from-tertiary-50",
        "to-tertiary-100",
        "dark:from-tertiary-950",
        "dark:to-tertiary-900",
        "border-tertiary-200 dark:border-tertiary-800"
      )}
      style={{
        backgroundImage: `
          linear-gradient(to bottom right, 
          var(--tw-gradient-stops)),
          linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(37, 99, 235, 0.1))
        `
      }}
    >
      {/* Accent diagonal bleu subtil en haut */}
      <div className="absolute top-0 right-0 h-24 w-1/2 bg-gradient-to-br from-tertiary-200/40 to-tertiary-300/10 dark:from-tertiary-800/20 dark:to-tertiary-700/5 rounded-tr-lg pointer-events-none" />
      
      {/* Point brillant dans le coin */}
      <div className="absolute top-4 right-4 h-20 w-20 rounded-full bg-gradient-to-br from-white/20 to-transparent dark:from-white/5 dark:to-transparent blur-xl pointer-events-none" />
      
      {!hideTitleBar && (
        <DialogHeader className="relative z-10 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg shadow-sm bg-tertiary-100 text-tertiary-700 dark:bg-tertiary-800 dark:text-tertiary-300">
              <PlusCircle className="w-5 h-5" />
            </div>
            <DialogTitle className="text-2xl font-bold text-tertiary-900 dark:text-tertiary-100">
              Ajouter une dépense
            </DialogTitle>
          </div>
          <div className="ml-[52px] mt-2">
            <DialogDescription className="text-base text-tertiary-700 dark:text-tertiary-400">
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

      <div className="absolute bottom-0 right-0 w-28 h-28 pointer-events-none opacity-[0.07] dark:opacity-[0.04]">
        <Receipt className="w-full h-full" />
      </div>
      
      {/* Ligne décorative subtile */}
      <div className="absolute bottom-4 left-4 w-16 h-0.5 bg-tertiary-300/30 dark:bg-tertiary-700/30 rounded-full pointer-events-none" />
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
          className={cn(
            "px-0 py-0 rounded-t-2xl",
            "border-t border-gray-200 dark:border-gray-800",
            "shadow-2xl",
            "border-tertiary-200 dark:border-tertiary-800",
            "h-[80vh] sm:h-[80vh] overflow-y-auto",
            "transition-all duration-300 ease-in-out",
            "backdrop-blur-sm bg-white/95 dark:bg-gray-900/95"
          )}
        >
          {/* Poignée de glissement améliorée */}
          <div className={cn(
            "absolute inset-x-0 top-0 w-16 mx-auto my-3",
            "flex items-center justify-center"
          )}>
            <div className={cn(
              "h-1.5 w-12",
              "bg-gray-300 dark:bg-gray-600 rounded-full",
              "hover:bg-gray-400 dark:hover:bg-gray-500",
              "transition-colors duration-200"
            )} />
          </div>
          
          {/* Contenu avec padding */}
          <div className="mt-4" >
            {dialogContent}
          </div>
          
          {/* Indicateur de scroll optionnel - apparaît seulement si le contenu est scrollable */}
          <div className={cn(
            "absolute bottom-4 inset-x-0 flex justify-center",
            "pointer-events-none opacity-70"
          )}>
            <div className="w-1.5 h-8 rounded-full bg-gray-200 dark:bg-gray-700"></div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Version desktop avec Dialog
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px] p-0 border-0 overflow-hidden bg-transparent shadow-xl">
        {dialogContent}
      </DialogContent>
    </Dialog>
  );
}