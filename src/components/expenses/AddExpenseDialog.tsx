import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Receipt, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRetailers } from "@/components/settings/retailers/useRetailers";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ExpenseForm } from "./ExpenseForm";
import { useExpenseForm } from "./useExpenseForm";
import { AddExpenseDialogProps } from "./types";

export function AddExpenseDialog({ onExpenseAdded, preSelectedRetailer, open, onOpenChange }: AddExpenseDialogProps) {
  const [showNoRetailerAlert, setShowNoRetailerAlert] = useState(false);
  const { retailers } = useRetailers();
  const navigate = useNavigate();
  const { handleSubmit } = useExpenseForm(onExpenseAdded);
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  
  const onSubmit = async (values: any) => {
    const success = await handleSubmit(values);
    if (success && onOpenChange) {
      onOpenChange(false);
    }
  };

  const handleAddClick = () => {
    if (!retailers?.length && !preSelectedRetailer) {
      setShowNoRetailerAlert(true);
    } else if (onOpenChange) {
      onOpenChange(true);
    }
  };

  return (
    <>
      {!preSelectedRetailer && (
        <Button 
          onClick={handleAddClick} 
          className={cn(
            "h-10 px-4 text-white transition-all duration-200 rounded-md",
            "bg-blue-500 hover:bg-blue-600 shadow-sm",
            "hover:scale-[1.02] active:scale-[0.98]",
            "dark:bg-blue-600 dark:hover:bg-blue-500",
            "dark:text-white"
          )}
          style={{
            boxShadow: isDarkMode
              ? "0 2px 10px -2px rgba(37, 99, 235, 0.2)"
              : "0 2px 10px -2px rgba(37, 99, 235, 0.15)"
          }}
        >
          <div className="flex items-center gap-1.5">
            <Plus className="h-4 w-4" />
            <span className="font-medium text-sm">Ajouter</span>
          </div>
        </Button>
      )}

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[90vw] max-w-[650px] max-h-[95vh] overflow-y-auto p-0">
          {/* Fond bleu subtil */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-white dark:bg-gray-800" />
            <div className={cn(
              "absolute inset-0 bg-gradient-to-br from-blue-50/80 to-white/60",
              "dark:from-blue-900/10 dark:to-gray-800/90"
            )} />
          </div>
          
          <div className="relative z-10 p-6 sm:p-8">
            <DialogHeader className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2.5 rounded-lg",
                  "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300"
                )}>
                  <Receipt className="w-5 h-5" />
                </div>
                <DialogTitle className={cn(
                  "text-xl sm:text-2xl font-bold",
                  "text-blue-900 dark:text-blue-200"
                )}>
                  Ajouter une dépense
                </DialogTitle>
              </div>
              
              <DialogDescription className={cn(
                "text-base",
                "text-blue-700/80 dark:text-blue-300/80"
              )}>
                Créez une nouvelle dépense en complétant le formulaire ci-dessous. Vous pourrez la modifier ultérieurement.
              </DialogDescription>
            </DialogHeader>
          
            {/* Ligne séparatrice subtile */}
            <div className="w-full h-px mb-6 bg-gradient-to-r from-transparent via-blue-100 to-transparent dark:via-blue-800/30" />
          
            {/* Section du formulaire */}
            <div className="relative z-10">
              <ExpenseForm 
                onSubmit={onSubmit}
                preSelectedRetailer={preSelectedRetailer}
              />
            </div>
          
            {/* Décoration graphique dans le coin inférieur droit */}
            <div className="absolute bottom-0 right-0 w-32 h-32 pointer-events-none opacity-[0.025] z-0">
              <Receipt className="w-full h-full" />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog 
        open={showNoRetailerAlert}
        onOpenChange={setShowNoRetailerAlert}
      >
        <AlertDialogContent className="sm:max-w-[500px]">
          <div className="p-1">
            <AlertDialogHeader>
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2.5 rounded-lg",
                  "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300"
                )}>
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <AlertDialogTitle className={cn(
                  "text-xl font-bold",
                  "text-blue-900 dark:text-blue-200"
                )}>
                  Aucune enseigne disponible
                </AlertDialogTitle>
              </div>
              
              <AlertDialogDescription className={cn(
                "mt-2",
                "text-blue-700/80 dark:text-blue-300/80"
              )}>
                Vous devez d'abord créer une enseigne avant de pouvoir ajouter une dépense.
                Souhaitez-vous créer une enseigne maintenant?
              </AlertDialogDescription>
            </AlertDialogHeader>
            
            <AlertDialogFooter className="mt-6">
              <AlertDialogCancel 
                className="mt-0 border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Non, plus tard
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  setShowNoRetailerAlert(false);
                  navigate("/user-settings?tab=settings", { state: { scrollTo: "retailers" } });
                }}
                className={cn(
                  "bg-blue-500 hover:bg-blue-600",
                  "dark:bg-blue-600 dark:hover:bg-blue-500",
                  "text-white shadow-sm"
                )}
              >
                Oui, créer une enseigne
              </AlertDialogAction>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
