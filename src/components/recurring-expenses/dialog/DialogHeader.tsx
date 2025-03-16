import { cn } from "@/lib/utils";
import { DialogHeader as UIDialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Edit, Plus } from "lucide-react";

interface DialogHeaderProps {
  isEditMode: boolean;
}

export const DialogHeader = ({ isEditMode }: DialogHeaderProps) => {
  return (
    <div className="px-6 py-6 relative z-10">
      <UIDialogHeader>
        <div className="flex items-center gap-3">
          {/* Icône du dialogue */}
          <div 
            className={cn(
              "p-2.5 rounded-lg flex items-center justify-center flex-shrink-0",
              // Light mode - édition ou création
              isEditMode
                ? "bg-blue-100 text-blue-600" 
                : "bg-blue-100 text-blue-600",
              // Dark mode - édition ou création
              isEditMode
                ? "dark:bg-blue-900/30 dark:text-blue-300" 
                : "dark:bg-blue-900/30 dark:text-blue-300"
            )}
          >
            {isEditMode ? (
              <Edit size={22} />
            ) : (
              <Plus size={22} />
            )}
          </div>
          
          <div>
            <DialogTitle 
              className={cn(
                "text-xl sm:text-2xl font-bold",
                // Light mode
                "text-blue-900",
                // Dark mode
                "dark:text-blue-200"
              )}
            >
              {isEditMode ? "Modifier la charge récurrente" : "Ajouter une charge récurrente"}
            </DialogTitle>
            
            <DialogDescription 
              className={cn(
                "mt-1.5 text-base",
                // Light mode
                "text-blue-700/80",
                // Dark mode
                "dark:text-blue-300/80"
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
