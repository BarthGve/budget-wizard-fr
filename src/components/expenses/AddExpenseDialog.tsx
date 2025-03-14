import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Receipt, AlertTriangle, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRetailers } from "@/components/settings/retailers/useRetailers";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
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
        <DialogContent className="w-[90vw] max-w-[700px] sm:max-w-[90vw] md:max-w-[700px] overflow-hidden p-0">
          {/* Background subtil */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-white dark:bg-gray-800 opacity-95" />
            <div className={cn(
              "absolute inset-0 bg-gradient-to-br from-blue-50 to-white opacity-80",
              "dark:from-gray-800 dark:to-gray-900"
            )} />
            <div className={cn(
              "absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))]", 
              "from-blue-100/40 via-blue-50/20 to-transparent",
              "dark:from-blue-900/20 dark:via-blue-800/10 dark:to-transparent"
            )} />
          </div>

          {/* Bouton de fermeture */}
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20">
            <DialogClose asChild>
              <Button 
                type="button" 
                variant="ghost" 
                className={cn(
                  "h-8 w-8 p-0 rounded-md",
                  "text-gray-500 hover:text-gray-700 hover:bg-gray-100/80",
                  "dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800/80",
                  "transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500",
                  "disabled:pointer-events-none"
                )}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Fermer</span>
              </Button>
            </DialogClose>
          </div>
          
          <div className="relative z-10 p-5 sm:p-6 md:p-7">
            <DialogHeader className="space-y-1 mb-5 items-start">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2 sm:p-2.5 rounded-lg",
                  "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300"
                )}>
                  <Receipt className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <DialogTitle className={cn(
                  "text-xl sm:text-2xl font-bold",
                  "text-blue-900 dark:text-blue-200"
                )}>
                  Ajouter une dépense
                </DialogTitle>
              </div>
              
              <DialogDescription className={cn(
                "!mt-3 text-sm sm:text-base",
                "text-blue-700/80 dark:text-blue-300/80"
              )}>
                Créez une nouvelle dépense en complétant le formulaire ci-dessous. Vous pourrez la modifier ultérieurement.
              </DialogDescription>
            </DialogHeader>
            
            {/* Section du formulaire */}
            <div className="relative z-10 mt-4">
              <ExpenseForm 
                onSubmit={onSubmit}
                preSelectedRetailer={preSelectedRetailer}
              />
            </div>
            
            {/* Décoration graphique dans le coin inférieur droit */}
            <div className="absolute bottom-0 right-0 w-24 h-24 sm:w-32 sm:h-32 pointer-events-none opacity-[0.03] z-0">
              <Receipt className="w-full h-full" />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog 
        open={showNoRetailerAlert}
        onOpenChange={setShowNoRetailerAlert}
      >
        <AlertDialogContent className="sm:max-w-[500px] overflow-hidden p-0">
          {/* Background subtil */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-white dark:bg-gray-800 opacity-95" />
            <div className={cn(
              "absolute inset-0 bg-gradient-to-br from-blue-50 to-white opacity-80",
              "dark:from-gray-800 dark:to-gray-900"
            )} />
            <div className={cn(
              "absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))]", 
              "from-blue-100/40 via-blue-50/20 to-transparent",
              "dark:from-blue-900/20 dark:via-blue-800/10 dark:to-transparent"
            )} />
          </div>
          
          <div className="relative z-10 p-5 sm:p-6">
            <AlertDialogHeader className="space-y-1 mb-4">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2 sm:p-2.5 rounded-lg",
                  "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300"
                )}>
                  <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                
                <AlertDialogTitle className={cn(
                  "text-lg sm:text-xl font-bold",
                  "text-blue-900 dark:text-blue-200"
                )}>
                  Aucune enseigne disponible
                </AlertDialogTitle>
              </div>
              
              <AlertDialogDescription className={cn(
                "!mt-3 text-sm sm:text-base",
                "text-blue-700/80 dark:text-blue-300/80"
              )}>
                Vous devez d'abord créer une enseigne avant de pouvoir ajouter une dépense.
                Souhaitez-vous créer une enseigne maintenant?
              </AlertDialogDescription>
            </AlertDialogHeader>
            
            <AlertDialogFooter className="mt-5 flex-row gap-3 sm:gap-3 sm:justify-end">
              <AlertDialogCancel 
                className="mt-0 border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 bg-white dark:bg-transparent"
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
          
          {/* Décoration graphique dans le coin inférieur droit */}
          <div className="absolute bottom-0 right-0 w-24 h-24 pointer-events-none opacity-[0.03] z-0">
            <AlertTriangle className="w-full h-full" />
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
