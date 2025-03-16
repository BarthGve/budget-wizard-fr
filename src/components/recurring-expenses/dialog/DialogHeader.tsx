// DialogHeader.tsx
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
        "border-b border-blue-100/50 dark:border-blue-900/30",
        // Backgrounds
        isEditMode 
          ? "bg-gradient-to-br from-blue-50/90 to-white dark:from-blue-900/20 dark:to-gray-900/95" 
          : "bg-gradient-to-br from-blue-50/90 to-white dark:from-blue-900/20 dark:to-gray-900/95",
        // Rounded corners for header only
        "rounded-t-lg"
      )}
    >
      {/* Élément décoratif circulaire */}
      <div 
        className={cn(
          "absolute -top-16 -right-16 w-56 h-56 rounded-full opacity-10 blur-[2px]",
          // Light mode
          isEditMode
            ? "bg-gradient-to-br from-blue-300 to-blue-600"
            : "bg-gradient-to-br from-blue-300 to-blue-600",
          // Dark mode
          "dark:opacity-10"
        )}
      />

      <div className="absolute top-0 right-0 h-12 w-32 bg-blue-400/10 dark:bg-blue-500/5 rounded-bl-3xl rounded-tr-lg z-0 backdrop-blur-sm" />
      
      <UIDialogHeader className="relative z-10">
        <div className="flex items-start gap-4">
          {/* Icône du dialogue avec effet de profondeur */}
          <div 
            className={cn(
              "w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0",
              "transition-all",
              "shadow-sm",
              // Light mode - édition ou création
              isEditMode
                ? "bg-gradient-to-br from-blue-100 to-blue-50 text-blue-600" 
                : "bg-gradient-to-br from-blue-100 to-blue-50 text-blue-600",
              // Dark mode - édition ou création
              isEditMode
                ? "dark:bg-gradient-to-br dark:from-blue-900/30 dark:to-blue-950/20 dark:text-blue-400" 
                : "dark:bg-gradient-to-br dark:from-blue-900/30 dark:to-blue-950/20 dark:text-blue-400",
              // Border
              "border border-blue-200/50 dark:border-blue-800/30"
            )}
          >
            <div className="p-0.5">
              {isEditMode ? (
                <Edit size={22} />
              ) : (
                <Plus size={22} />
              )}
            </div>
          </div>
          
          <div>
            <DialogTitle 
              className={cn(
                "text-xl font-bold tracking-tight",
                "text-gray-800 dark:text-gray-100"
              )}
            >
              {isEditMode ? "Modifier la charge récurrente" : "Ajouter une charge récurrente"}
            </DialogTitle>
            
            <DialogDescription 
              className={cn(
                "mt-1.5 text-sm",
                "text-gray-600 dark:text-gray-400"
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
