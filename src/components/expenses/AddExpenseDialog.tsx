
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ExpenseForm } from "./ExpenseForm";
import { AddExpenseDialogProps } from "./types";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Sheet, SheetContent } from "../ui/sheet";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export function AddExpenseDialog({ 
  onExpenseAdded, 
  preSelectedRetailer, 
  open, 
  onOpenChange,
  hideDialogWrapper = false 
}: AddExpenseDialogProps & { hideDialogWrapper?: boolean }) {
  const isMobile = useMediaQuery("(max-width: 640px)");
  
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
              className="w-full sm:w-auto"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className={cn(
                "bg-blue-500 hover:bg-blue-600 text-white w-full sm:w-auto",
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

  // Pour mobile, on utilise une Sheet (drawer)
  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="p-0 rounded-t-xl max-h-[90vh] overflow-y-auto">
          <div className="relative">
            {/* En-tête de la modale */}
            <div className="px-6 py-5 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-t-xl">
              <div className="flex items-center gap-3">
                {/* Icône d'ajout */}
                <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-800/40 flex items-center justify-center">
                  <Plus size={20} className="text-blue-600 dark:text-blue-300" />
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-200">
                    Ajouter une dépense
                  </h3>
                  <p className="text-sm text-blue-600/80 dark:text-blue-300/80">
                    Ajoutez une nouvelle dépense pour {preSelectedRetailer?.name || "cette enseigne"}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Formulaire */}
            <div className="p-5">
              <ExpenseForm 
                onExpenseAdded={onExpenseAdded} 
                preSelectedRetailer={preSelectedRetailer}
                buttonClassName="hidden"
                renderCustomActions={(isSubmitting) => (
                  <div className="flex gap-3 mt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => onOpenChange?.(false)}
                      className="flex-1"
                    >
                      Annuler
                    </Button>
                    <Button
                      type="submit"
                      className={cn(
                        "bg-blue-500 hover:bg-blue-600 text-white flex-1",
                        "dark:bg-blue-600 dark:hover:bg-blue-500",
                        "transition-colors duration-200",
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
            
            {/* Bouton fermer */}
            <button 
              onClick={() => onOpenChange?.(false)}
              className="absolute right-4 top-4 p-1.5 rounded-full text-blue-600/70 hover:bg-blue-100/80 dark:text-blue-300/70 dark:hover:bg-blue-800/30"
            >
              <X size={18} />
              <span className="sr-only">Fermer</span>
            </button>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Pour desktop, on utilise un Dialog
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden rounded-xl">
        <div className="relative">
          {/* En-tête de la modale */}
          <div className="px-6 py-5 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
            <div className="flex items-center gap-3">
              {/* Icône d'ajout */}
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-800/40 flex items-center justify-center">
                <Plus size={20} className="text-blue-600 dark:text-blue-300" />
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-200">
                  Ajouter une dépense
                </h3>
                <p className="text-sm text-blue-600/80 dark:text-blue-300/80">
                  Ajoutez une nouvelle dépense pour {preSelectedRetailer?.name || "cette enseigne"}
                </p>
              </div>
            </div>
          </div>
          
          {/* Formulaire */}
          <div className="p-6">
            <ExpenseForm 
              onExpenseAdded={onExpenseAdded} 
              preSelectedRetailer={preSelectedRetailer}
              buttonClassName="hidden"
              renderCustomActions={(isSubmitting) => (
                <div className="flex justify-end gap-3 mt-6">
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
                      "transition-colors duration-200",
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
          
          {/* Bouton fermer */}
          <button 
            onClick={() => onOpenChange?.(false)}
            className="absolute right-4 top-4 p-1.5 rounded-full text-blue-600/70 hover:bg-blue-100/80 dark:text-blue-300/70 dark:hover:bg-blue-800/30"
          >
            <X size={18} />
            <span className="sr-only">Fermer</span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
