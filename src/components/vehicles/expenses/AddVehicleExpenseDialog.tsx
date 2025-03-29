
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ExpenseForm } from "./form/ExpenseForm";
import { ExpenseInitialValues } from "@/hooks/useExpenseForm";
import { cn } from "@/lib/utils";
import { Fuel, PlusCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useRef } from "react";

interface AddVehicleExpenseDialogProps {
  vehicleId: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  isEditMode?: boolean;
  expenseId?: string;
  initialValues?: ExpenseInitialValues;
  onSuccess?: () => void;
  onCancel?: () => void;
  hideDialogWrapper?: boolean;
  colorScheme?: "green" | "blue" | "purple";
  hideTitleBar?: boolean;
}

export const AddVehicleExpenseDialog = ({ 
  vehicleId, 
  open, 
  onOpenChange,
  isEditMode = false,
  expenseId,
  initialValues,
  onSuccess,
  onCancel,
  hideDialogWrapper = false,
  colorScheme = "green",
  hideTitleBar = false
}: AddVehicleExpenseDialogProps) => {
  
  const contentRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  // Gestionnaire d'annulation par défaut
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else if (onOpenChange) {
      onOpenChange(false);
    }
  };
  
  // Couleurs dynamiques selon le colorScheme
  const colors = {
    blue: {
      gradientFrom: "from-blue-50",
      gradientTo: "to-blue-100",
      darkGradientFrom: "dark:from-blue-950",
      darkGradientTo: "dark:to-blue-900",
      iconBg: "bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-300",
      headingText: "text-blue-900 dark:text-blue-100",
      descriptionText: "text-blue-700 dark:text-blue-400",
      buttonBg: "bg-blue-600 hover:bg-blue-500 dark:bg-blue-700 dark:hover:bg-blue-600",
      border: "border-blue-200 dark:border-blue-800",
    },
    green: {
      gradientFrom: "from-green-50",
      gradientTo: "to-green-100",
      darkGradientFrom: "dark:from-green-950",
      darkGradientTo: "dark:to-green-900",
      iconBg: "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-300",
      headingText: "text-green-900 dark:text-green-100",
      descriptionText: "text-green-700 dark:text-green-400",
      buttonBg: "bg-green-600 hover:bg-green-500 dark:bg-green-700 dark:hover:bg-green-600",
      border: "border-green-200 dark:border-green-800",
    },
    purple: {
      gradientFrom: "from-purple-50",
      gradientTo: "to-purple-100",
      darkGradientFrom: "dark:from-purple-950",
      darkGradientTo: "dark:to-purple-900",
      iconBg: "bg-purple-100 text-purple-700 dark:bg-purple-800 dark:text-purple-300",
      headingText: "text-purple-900 dark:text-purple-100",
      descriptionText: "text-purple-700 dark:text-purple-400",
      buttonBg: "bg-purple-600 hover:bg-purple-500 dark:bg-purple-700 dark:hover:bg-purple-600",
      border: "border-purple-200 dark:border-purple-800",
    },
  };
  
  const currentColors = colors[colorScheme];
  
  // Contenu du dialogue amélioré avec des effets visuels
  const dialogContent = (
    <div 
      ref={contentRef}
      className={cn(
        "relative flex flex-col pb-6 p-6 rounded-lg border",
        "bg-gradient-to-br",
        currentColors.gradientFrom,
        currentColors.gradientTo,
        currentColors.darkGradientFrom,
        currentColors.darkGradientTo,
        currentColors.border
      )}
      style={{
        backgroundImage: `
          linear-gradient(to bottom right, 
          var(--tw-gradient-stops)),
          linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(37, 99, 235, 0.1))
        `
      }}
    >
      {/* Accent diagonal en haut */}
      <div className="absolute top-0 right-0 h-24 w-1/2 bg-gradient-to-br from-green-200/40 to-green-300/10 dark:from-green-800/20 dark:to-green-700/5 rounded-tr-lg pointer-events-none" />
      
      {/* Point brillant dans le coin */}
      <div className="absolute top-4 right-4 h-20 w-20 rounded-full bg-gradient-to-br from-white/20 to-transparent dark:from-white/5 dark:to-transparent blur-xl pointer-events-none" />
      
      {!hideTitleBar && (
        <DialogHeader className="relative z-10 mb-4">
          <div className="flex items-center gap-3">
            <div className={cn("p-2.5 rounded-lg shadow-sm", currentColors.iconBg)}>
              <Fuel className="w-5 h-5" />
            </div>
            <DialogTitle className={cn("text-2xl font-bold", currentColors.headingText)}>
              {isEditMode ? 'Modifier' : 'Ajouter'} une dépense de carburant
            </DialogTitle>
          </div>
          <div className="ml-[52px] mt-2">
            <DialogDescription className={cn("text-base", currentColors.descriptionText)}>
              {isEditMode ? 'Modifiez' : 'Ajoutez'} les détails de votre dépense de carburant.
            </DialogDescription>
          </div>
        </DialogHeader>
      )}

      <div className="relative z-10 px-1">
        <ExpenseForm
          vehicleId={vehicleId}
          isEditMode={isEditMode}
          expenseId={expenseId}
          initialValues={initialValues}
          onSuccess={onSuccess}
          onCancel={handleCancel}
        />
      </div>

      {/* Icône décorative en filigrane */}
      <div className="absolute bottom-0 right-0 w-28 h-28 pointer-events-none opacity-[0.07] dark:opacity-[0.04]">
        <Fuel className="w-full h-full" />
      </div>
      
      {/* Ligne décorative subtile */}
      <div className="absolute bottom-4 left-4 w-16 h-0.5 bg-green-300/30 dark:bg-green-700/30 rounded-full pointer-events-none" />
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
            "px-0 py-0 rounded-t-xl",
            "border-t shadow-lg",
            currentColors.border,
            "max-h-[90vh] overflow-y-auto",
            "dark:bg-gray-900"
          )}
        >
          <div className={cn(
            "absolute inset-x-0 top-0 h-1.5 w-12 mx-auto my-2",
            "bg-gray-300 dark:bg-gray-600 rounded-full"
          )} />
          
          {dialogContent}
        </SheetContent>
      </Sheet>
    );
  }

  // Version desktop avec Dialog standard
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px] p-0 border-0 overflow-hidden bg-transparent shadow-xl">
        {dialogContent}
      </DialogContent>
    </Dialog>
  );
};
