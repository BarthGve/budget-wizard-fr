
import { cn } from "@/lib/utils";
import { DialogHeader as UIDialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Edit, Plus } from "lucide-react";

interface DialogHeaderProps {
  isEditMode: boolean;
}

export const DialogHeader = ({ isEditMode }: DialogHeaderProps) => {
  return (
    <div 
      className={cn(
        "relative px-6 py-6 flex-shrink-0",
        // Light mode
        isEditMode 
          ? "bg-gradient-to-br from-blue-50 to-white" 
          : "bg-gradient-to-br from-blue-50 to-white",
        // Dark mode
        isEditMode
          ? "dark:bg-gradient-to-br dark:from-amber-900/10 dark:to-gray-800/95"
          : "dark:bg-gradient-to-br dark:from-blue-900/10 dark:to-gray-800/95"
      )}
    >
      {/* Élément décoratif circulaire */}
      <div 
        className={cn(
          "absolute -top-20 -right-20 w-56 h-56 rounded-full opacity-20",
          // Light mode
          isEditMode
            ? "bg-gradient-to-br from-blue-300 to-blue-500"
            : "bg-gradient-to-br from-blue-400 to-blue-600",
          // Dark mode
          "dark:opacity-10"
        )}
      />
      
      <UIDialogHeader className="relative z-10">
        <div className="flex items-start gap-4">
          {/* Icône du dialogue */}
          <div 
            className={cn(
              "w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0",
              // Light mode - édition ou création
              isEditMode
                ? "bg-amber-100 text-blue-600" 
                : "bg-blue-100 text-blue-600",
              // Dark mode - édition ou création
              isEditMode
                ? "dark:bg-amber-900/20 dark:text-blue-400" 
                : "dark:bg-blue-900/20 dark:text-blue-400"
            )}
          >
            {isEditMode ? (
              <Edit size={24} />
            ) : (
              <Plus size={24} />
            )}
          </div>
          
          <div>
            <DialogTitle 
              className={cn(
                "text-xl font-bold tracking-tight",
                // Light mode
                "text-gray-800",
                // Dark mode
                "dark:text-gray-100"
              )}
            >
              {isEditMode ? "Modifier la charge récurrente" : "Ajouter une charge récurrente"}
            </DialogTitle>
            
            <DialogDescription 
              className={cn(
                "mt-1.5 text-sm",
                // Light mode
                "text-gray-600",
                // Dark mode
                "dark:text-gray-400"
              )}
            >
              {isEditMode 
                ? "Modifiez les informations de votre charge récurrente. Les modifications seront appliquées immédiatement."
                : "Ajoutez une nouvelle charge récurrente en remplissant les informations ci-dessous. Un logo sera automatiquement ajouté si disponible."}
            </DialogDescription>
          </div>
        </div>
      </UIDialogHeader>
    </div>
  );
};
