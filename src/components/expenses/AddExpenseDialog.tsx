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
          variant="outline"
          className={cn(
            "h-10 px-4 border transition-all duration-200 rounded-md",
            "hover:scale-[1.02] active:scale-[0.98]",
            "bg-white border-blue-200 text-blue-600",
            "hover:border-blue-300 hover:bg-blue-50/50 hover:text-blue-700",
            "dark:bg-gray-800 dark:border-blue-800/60 dark:text-blue-400",
            "dark:hover:bg-blue-900/20 dark:hover:border-blue-700 dark:hover:text-blue-300"
          )}
          style={{
            boxShadow: isDarkMode
              ? "0 2px 10px -2px rgba(37, 99, 235, 0.15)"
              : "0 2px 10px -2px rgba(37, 99, 235, 0.1)"
          }}
        >
          <div className="flex items-center gap-1.5">
            <span className={cn(
              "flex items-center justify-center w-5 h-5 rounded-md transition-colors",
              "bg-blue-100/80 text-blue-600",
              "dark:bg-blue-800/50 dark:text-blue-300"
            )}>
              <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
            </span>
            <span className="font-medium text-sm">Ajouter</span>
          </div>
        </Button>
      )}

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[90vw] max-w-[650px] max-h-[95vh] overflow-y-auto">
        <div className="relative z-10 pt-2 pb-5 px-1 sm:p-2">



          <DialogHeader className="p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2.5 rounded-lg",
                "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300"
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
              "mt-1.5 text-base",
              "text-blue-700/80 dark:text-blue-300/80"
            )}>
              Créez une nouvelle dépense en complétant le formulaire ci-dessous. Vous pourrez la modifier ultérieurement.
            </DialogDescription>
          </DialogHeader>
        </div>
          
          {/* Section du formulaire */}
          <div className="relative z-10">
            <ExpenseForm 
              onSubmit={onSubmit}
              preSelectedRetailer={preSelectedRetailer}
            />
          </div>
          
          {/* Décoration graphique dans le coin inférieur droit - subtile */}
          <div className="absolute bottom-0 right-0 w-32 h-32 pointer-events-none opacity-[0.025] z-0">
            <Receipt className="w-full h-full" />
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog 
        open={showNoRetailerAlert}
        onOpenChange={setShowNoRetailerAlert}
      >
        <AlertDialogContent className="sm:max-w-[500px]">
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
          
          <AlertDialogFooter className="mt-4">
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
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
