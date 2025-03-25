
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ExpenseForm } from "./ExpenseForm";
import { AddExpenseDialogProps } from "./types";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { Button } from "../ui/button";

export function AddExpenseDialog({ 
  onExpenseAdded, 
  preSelectedRetailer, 
  open, 
  onOpenChange,
  hideDialogWrapper = false 
}: AddExpenseDialogProps & { hideDialogWrapper?: boolean }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  // Si hideDialogWrapper est vrai, on n'affiche pas le Dialog wrapper
  if (hideDialogWrapper) {
    return (
      <ExpenseForm 
        onExpenseAdded={onExpenseAdded} 
        preSelectedRetailer={preSelectedRetailer}
        renderCustomActions={(isSubmitting) => (
          <div className="flex justify-end space-x-4 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange?.(false)}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className={cn(
                "bg-blue-500 hover:bg-blue-600 text-white",
                "dark:bg-blue-600 dark:hover:bg-blue-500",
                "transition-colors duration-200 shadow-sm",
                "focus-visible:ring-blue-500",
                isSubmitting && "opacity-80 cursor-not-allowed"
              )}
              disabled={isSubmitting}
            >
              {isSubmitting ? "En cours..." : "Ajouter"}
            </Button>
          </div>
        )}
      />
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
        <div className="relative">
          {/* Header avec fond de couleur */}
          <div 
            className={cn(
              "px-6 py-6 relative z-10",
              "bg-blue-50 dark:bg-blue-900/30"
            )}
          >
            <DialogHeader>
              <div className="flex items-center gap-3">
                {/* Icône d'ajout */}
                <div 
                  className={cn(
                    "p-2.5 rounded-full flex items-center justify-center flex-shrink-0",
                    "bg-blue-100 text-blue-600",
                    "dark:bg-blue-800/50 dark:text-blue-300"
                  )}
                >
                  <Plus size={18} />
                </div>
                
                <div>
                  <DialogTitle 
                    className={cn(
                      "text-xl font-bold",
                      "text-blue-800 dark:text-blue-200"
                    )}
                  >
                    Ajouter une dépense
                  </DialogTitle>
                  
                  <p 
                    className={cn(
                      "mt-1 text-sm",
                      "text-blue-700/80 dark:text-blue-300/80"
                    )}
                  >
                    Ajoutez une nouvelle dépense pour {preSelectedRetailer?.name || "cette enseigne"}
                  </p>
                </div>
              </div>
            </DialogHeader>
          </div>
          
          {/* Corps du formulaire */}
          <div className="px-6 py-6">
            <ExpenseForm 
              onExpenseAdded={onExpenseAdded} 
              preSelectedRetailer={preSelectedRetailer}
              buttonClassName="hidden"
              renderCustomActions={(isSubmitting) => (
                <div className="flex justify-end space-x-4 mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange?.(false)}
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    className={cn(
                      "bg-blue-500 hover:bg-blue-600 text-white",
                      "dark:bg-blue-600 dark:hover:bg-blue-500",
                      "transition-colors duration-200 shadow-sm",
                      "focus-visible:ring-blue-500",
                      isSubmitting && "opacity-80 cursor-not-allowed"
                    )}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "En cours..." : "Ajouter"}
                  </Button>
                </div>
              )}
            />
          </div>
          
          {/* Bouton de fermeture personnalisé */}
          <button 
            onClick={() => onOpenChange?.(false)}
            className={cn(
              "absolute right-4 top-4 p-1 rounded-full",
              "text-blue-600 hover:bg-blue-100/80",
              "dark:text-blue-300 dark:hover:bg-blue-800/30",
              "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            )}
          >
            <X size={18} />
            <span className="sr-only">Fermer</span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
