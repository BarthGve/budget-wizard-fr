import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Receipt, AlertTriangle } from "lucide-react";
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
            // Light mode
            "bg-white border-indigo-200 text-indigo-600",
            "hover:border-indigo-300 hover:bg-indigo-50/50 hover:text-indigo-700",
            // Dark mode
            "dark:bg-gray-800 dark:border-indigo-800/60 dark:text-indigo-400",
            "dark:hover:bg-indigo-900/20 dark:hover:border-indigo-700 dark:hover:text-indigo-300"
          )}
          style={{
            boxShadow: isDarkMode
              ? "0 2px 10px -2px rgba(79, 70, 229, 0.15)"
              : "0 2px 10px -2px rgba(79, 70, 229, 0.1)"
          }}
        >
          <div className="flex items-center gap-1.5">
            <span className={cn(
              "flex items-center justify-center w-5 h-5 rounded-md transition-colors",
              // Light mode
              "bg-indigo-100/80 text-indigo-600",
              // Dark mode
              "dark:bg-indigo-800/50 dark:text-indigo-300"
            )}>
              <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
            </span>
            <span className="font-medium text-sm">Ajouter</span>
          </div>
        </Button>
      )}

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent 
          className={cn(
            "p-0 overflow-hidden border-0 shadow-2xl",
            "sm:max-w-[550px]",
            // Light mode
            "bg-white",
            // Dark mode
            "dark:bg-gray-800/95"
          )}
          style={{
            boxShadow: isDarkMode
              ? "0 25px 50px -12px rgba(2, 6, 23, 0.4), 0 0 0 1px rgba(79, 70, 229, 0.1)"
              : "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(79, 70, 229, 0.1)"
          }}
        >
          {/* En-tête avec dégradé subtil */}
          <div 
            className={cn(
              "relative overflow-hidden",
              // Light mode
              "bg-gradient-to-br from-indigo-50 to-white",
              // Dark mode
              "dark:bg-gradient-to-br dark:from-indigo-900/20 dark:to-gray-800/90"
            )}
          >
            {/* Cercle décoratif en arrière-plan */}
            <div className={cn(
              "absolute -top-24 -right-24 w-64 h-64 rounded-full opacity-20",
              // Light mode
              "bg-gradient-to-br from-indigo-400 to-purple-500",
              // Dark mode
              "dark:from-indigo-500 dark:to-purple-600 dark:opacity-10"
            )} />

            {/* Header avec contenu amélioré */}
            <div className="px-6 pt-6 pb-4 relative z-10">
              <div className="flex items-start gap-4 mb-2">
                <div className={cn(
                  "p-2.5 rounded-xl",
                  // Light mode
                  "bg-indigo-100 text-indigo-600",
                  // Dark mode
                  "dark:bg-indigo-800/40 dark:text-indigo-400"
                )}>
                  <Receipt size={22} />
                </div>
                
                <div className="flex-1">
                  <DialogTitle 
                    className={cn(
                      "text-xl font-bold",
                      // Light mode
                      "text-indigo-700",
                      // Dark mode
                      "dark:text-indigo-300"
                    )}
                  >
                    Ajouter une dépense
                  </DialogTitle>
                  
                  <DialogDescription 
                    className={cn(
                      "mt-1.5 text-sm",
                      // Light mode
                      "text-indigo-600/70",
                      // Dark mode
                      "dark:text-indigo-300/70"
                    )}
                  >
                    Créez une nouvelle dépense en complétant le formulaire ci-dessous
                  </DialogDescription>
                </div>
              </div>
            </div>
          </div>

          {/* Ligne séparatrice avec dégradé */}
          <div className={cn(
            "h-px w-full",
            // Light mode
            "bg-gradient-to-r from-transparent via-indigo-100 to-transparent",
            // Dark mode
            "dark:from-transparent dark:via-indigo-900/30 dark:to-transparent"
          )} />

          {/* Conteneur pour le formulaire */}
          <div className={cn(
            "p-6",
            // Light mode
            "bg-white",
            // Dark mode
            "dark:bg-gray-800/95"
          )}>
            <ExpenseForm 
              onSubmit={onSubmit}
              preSelectedRetailer={preSelectedRetailer}
            />
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog 
        open={showNoRetailerAlert}
        onOpenChange={setShowNoRetailerAlert}
      >
        <AlertDialogContent
          className={cn(
            "p-0 overflow-hidden border-0 shadow-2xl",
            // Light mode
            "bg-white",
            // Dark mode
            "dark:bg-gray-800/95"
          )}
          style={{
            boxShadow: isDarkMode
              ? "0 25px 50px -12px rgba(2, 6, 23, 0.4)"
              : "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
          }}
        >
          <div 
            className={cn(
              "relative overflow-hidden",
              // Light mode - orange alert color scheme
              "bg-gradient-to-br from-amber-50 to-white",
              // Dark mode
              "dark:bg-gradient-to-br dark:from-amber-900/20 dark:to-gray-800/90"
            )}
          >
            <AlertDialogHeader className="p-6">
              <div className="flex items-start gap-4">
                <div className={cn(
                  "p-2.5 rounded-xl",
                  // Light mode - warning color
                  "bg-amber-100 text-amber-600",
                  // Dark mode
                  "dark:bg-amber-800/40 dark:text-amber-400"
                )}>
                  <AlertTriangle size={22} />
                </div>
              
                <div className="flex-1">
                  <AlertDialogTitle 
                    className={cn(
                      "text-xl font-bold",
                      "text-amber-700",
                      "dark:text-amber-300"
                    )}
                  >
                    Aucune enseigne disponible
                  </AlertDialogTitle>
                  <AlertDialogDescription className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    Vous devez d'abord créer une enseigne avant de pouvoir ajouter une dépense.  
                    Souhaitez-vous créer une enseigne maintenant?
                  </AlertDialogDescription>
                </div>
              </div>
            </AlertDialogHeader>
          </div>
          
          {/* Ligne séparatrice avec dégradé */}
          <div className={cn(
            "h-px w-full",
            "bg-gradient-to-r from-transparent via-amber-100 to-transparent",
            "dark:from-transparent dark:via-amber-900/30 dark:to-transparent"
          )} />
          
          <AlertDialogFooter className="p-4 flex gap-3 sm:gap-0">
            <AlertDialogCancel 
              className={cn(
                "mt-0 rounded-md",
                "border-gray-200 text-gray-700",
                "hover:bg-gray-100/70 hover:text-gray-800",
                "dark:border-gray-700 dark:text-gray-300",
                "dark:hover:bg-gray-700/50 dark:hover:text-gray-100"
              )}
            >
              Non, plus tard
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowNoRetailerAlert(false);
                navigate("/settings", { state: { scrollTo: "retailers" } });
              }}
              className={cn(
                "rounded-md",
                "bg-gradient-to-r from-amber-500 to-amber-600",
                "hover:from-amber-600 hover:to-amber-700",
                "dark:from-amber-600 dark:to-amber-700",
                "dark:hover:from-amber-500 dark:hover:to-amber-600",
                "text-white"
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
