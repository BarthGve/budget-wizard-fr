
import { cn } from "@/lib/utils";
import { DialogHeader as UIDialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Edit, Plus } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface DialogHeaderProps {
  isEditMode: boolean;
}

export const DialogHeader = ({ isEditMode }: DialogHeaderProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className={cn(
      "px-6 py-6 relative z-10",
      isMobile && "px-3 py-2"
    )}>
      <UIDialogHeader>
        <div className="flex items-center gap-3">
          {/* Icône du dialogue */}
          <div 
            className={cn(
              "p-2.5 rounded-lg flex items-center justify-center flex-shrink-0",
              // Light mode - édition ou création
              isEditMode
                ? "bg-tertiary-100 text-tertiary-600" 
                : "bg-tertiary-100 text-tertiary-600",
              // Dark mode - édition ou création
              isEditMode
                ? "dark:bg-tertiary-900/30 dark:text-tertiary-300" 
                : "dark:bg-tertiary-900/30 dark:text-tertiary-300",
              // Mobile
              isMobile && "p-2"
            )}
          >
            {isEditMode ? (
              <Edit size={isMobile ? 18 : 22} />
            ) : (
              <Plus size={isMobile ? 18 : 22} />
            )}
          </div>
          
          <div>
            <DialogTitle 
              className={cn(
                "text-xl sm:text-2xl font-bold",
                // Light mode
                "text-tertiary-900",
                // Dark mode
                "dark:text-tertiary-200",
                // Mobile
                isMobile && "text-lg"
              )}
            >
              {isEditMode ? "Modifier la charge récurrente" : "Ajouter une charge récurrente"}
            </DialogTitle>
            
            <DialogDescription 
              className={cn(
                "mt-1.5 text-base",
                // Light mode
                "text-tertiary-700/80",
                // Dark mode
                "dark:text-tertiary-300/80",
                // Mobile
                isMobile && "text-sm mt-1 line-clamp-2"
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
