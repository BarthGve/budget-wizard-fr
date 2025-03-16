import { useState, useRef, memo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Receipt, AlertTriangle, X, EditIcon } from "lucide-react";
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
import { useMediaQuery } from "@/hooks/useMediaQuery";

export const AddExpenseDialog = memo(({ 
  onExpenseAdded, 
  preSelectedRetailer, 
  open: controlledOpen, 
  onOpenChange: controlledOnOpenChange,
  expense
}: AddExpenseDialogProps) => {
  const [showNoRetailerAlert, setShowNoRetailerAlert] = useState(false);
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const { retailers } = useRetailers();
  const navigate = useNavigate();
  const { handleSubmit } = useExpenseForm(onExpenseAdded);
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Gestion de l'état contrôlé/non contrôlé
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const onOpenChange = isControlled ? controlledOnOpenChange : setUncontrolledOpen;
  
  // Détecter si nous sommes sur tablette
  const isTablet = useMediaQuery("(min-width: 640px) and (max-width: 1023px)");
  
  // Déterminer si on est en mode édition
  const isEditMode = !!expense;
  
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

  // Couleurs pour le thème bleu - inspiré de CreditDialog
  const colors = {
    gradientFrom: "from-blue-500",
    gradientTo: "to-sky-400",
    darkGradientFrom: "dark:from-blue-600",
    darkGradientTo: "dark:to-sky-500",
    iconBg: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    headingText: "text-blue-900 dark:text-blue-200",
    descriptionText: "text-blue-700/80 dark:text-blue-300/80",
    buttonBg: "bg-blue-600 hover:bg-blue-500 dark:bg-blue-700 dark:hover:bg-blue-600",
    lightBg: "from-white via-blue-50/40 to-blue-100/70",
    darkBg: "dark:from-gray-900 dark:via-blue-950/20 dark:to-blue-900/30", 
    borderLight: "border-blue-100/70",
    borderDark: "dark:border-blue-800/20",
    separator: "via-blue-200/60 dark:via-blue-800/30"
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
        {preSelectedRetailer && <DialogTrigger asChild>{preSelectedRetailer}</DialogTrigger>}
        
        <DialogContent 
          className={cn(
            "sm:max-w-[650px] w-full p-0 shadow-lg rounded-lg border",
            isTablet ? "sm:max-w-[85%] w-[85%]" : "w-[90vw]",
            "max-h-[95vh] overflow-y-auto",
            colors.borderLight,
            colors.borderDark,
            "dark:bg-gray-900"
          )}
        >
          <div 
            ref={contentRef}
            className={cn(
              "relative flex flex-col pb-6 p-6 rounded-lg",
              "bg-gradient-to-br",
              colors.lightBg,
              colors.darkBg
            )}
          >
            {/* Background gradient */}
            <div className={cn(
              "absolute inset-0 pointer-events-none opacity-5 bg-gradient-to-br rounded-lg",
              colors.gradientFrom,
              colors.gradientTo,
              colors.darkGradientFrom,
              colors.darkGradientTo
            )} />

            {/* Radial gradient */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/40 via-blue-50/20 to-transparent opacity-60 dark:from-blue-800/15 dark:via-blue-700/10 dark:to-transparent dark:opacity-30 rounded-lg" />
            
            {/* Bouton de fermeture (X) */}
            <DialogClose 
              className={cn(
                "absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 z-20",
                "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
              )}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>

            {/* Dialog header */}
            <DialogHeader className="relative z-10 mb-4">
              <div className="flex items-center gap-3">
                <div className={cn("p-2.5 rounded-lg", colors.iconBg)}>
                  {isEditMode ? <EditIcon className="w-5 h-5" /> : <Receipt className="w-5 h-5" />}
                </div>
                <DialogTitle className={cn("text-2xl font-bold", colors.headingText)}>
                  {isEditMode ? "Modifier la dépense" : "Ajouter une dépense"}
                </DialogTitle>
              </div>
              <div className="ml-[52px] mt-2">
                <DialogDescription className={cn("text-base", colors.descriptionText)}>
                  {isEditMode 
                    ? "Modifiez les informations de votre dépense. Les modifications seront appliquées immédiatement."
                    : "Créez une nouvelle dépense en complétant le formulaire ci-dessous. Vous pourrez la modifier ultérieurement."}
                </DialogDescription>
              </div>
            </DialogHeader>
            
            {/* Ligne séparatrice stylée */}
            <div className={cn(
              "h-px w-full mb-6",
              "bg-gradient-to-r from-transparent to-transparent",
              colors.separator
            )} />
            
            {/* Section du formulaire */}
            <div className="relative z-10">
              <ExpenseForm 
                onSubmit={onSubmit}
                preSelectedRetailer={preSelectedRetailer}
                expense={expense}
              />
            </div>
            
            {/* Décoration graphique dans le coin inférieur droit */}
            <div className="absolute bottom-0 right-0 w-32 h-32 pointer-events-none opacity-[0.03] dark:opacity-[0.02]">
              <Receipt className="w-full h-full" />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog 
        open={showNoRetailerAlert}
        onOpenChange={setShowNoRetailerAlert}
      >
        <AlertDialogContent 
          className={cn(
            "sm:max-w-[500px]",
            "p-0 border shadow-lg rounded-lg",
            colors.borderLight,
            colors.borderDark
          )}
        >
          <div className={cn(
            "relative flex flex-col p-6 rounded-lg",
            "bg-gradient-to-br",
            "from-white via-amber-50/40 to-amber-100/50",
            "dark:from-gray-900 dark:via-amber-950/10 dark:to-amber-900/20"
          )}>
            {/* Background gradient pour l'alerte */}
            <div className={cn(
              "absolute inset-0 pointer-events-none opacity-5 bg-gradient-to-br rounded-lg",
              "from-amber-500 to-yellow-400",
              "dark:from-amber-600 dark:to-yellow-500"
            )} />
            
            <AlertDialogHeader>
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2.5 rounded-lg",
                  "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                )}>
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <AlertDialogTitle className={cn(
                  "text-xl font-bold",
                  "text-amber-900 dark:text-amber-200"
                )}>
                  Aucune enseigne disponible
                </AlertDialogTitle>
              </div>
              
              <div className="ml-[52px] mt-2">
                <AlertDialogDescription className={cn(
                  "text-base",
                  "text-amber-700/80 dark:text-amber-300/80"
                )}>
                  Vous devez d'abord créer une enseigne avant de pouvoir ajouter une dépense.
                  Souhaitez-vous créer une enseigne maintenant?
                </AlertDialogDescription>
              </div>
            </AlertDialogHeader>
            
            <AlertDialogFooter className="mt-6">
              <AlertDialogCancel 
                className={cn(
                  "mt-0 bg-white dark:bg-gray-800",
                  "border-amber-200 text-amber-700 hover:bg-amber-50/50", 
                  "dark:border-amber-800/40 dark:text-amber-300 dark:hover:bg-amber-900/20"
                )}
              >
                Non, plus tard
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  setShowNoRetailerAlert(false);
                  navigate("/user-settings?tab=settings", { state: { scrollTo: "retailers" } });
                }}
                className={cn(
                  "bg-amber-500 hover:bg-amber-600",
                  "dark:bg-amber-700 dark:hover:bg-amber-600",
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
}, (prevProps, nextProps) => {
  return prevProps.open === nextProps.open &&
    prevProps.preSelectedRetailer === nextProps.preSelectedRetailer &&
    ((prevProps.expense?.id === nextProps.expense?.id) || (!prevProps.expense && !nextProps.expense));
});

AddExpenseDialog.displayName = "AddExpenseDialog";
