
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
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "next-themes";
import { AlertTriangleIcon, CarIcon } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";

interface VehicleDeleteDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: () => void;
  onMarkAsSold: () => void;
}

export const VehicleDeleteDialog = ({
  isOpen,
  onOpenChange,
  onDelete,
  onMarkAsSold,
}: VehicleDeleteDialogProps) => {
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  
  // Couleurs du thème gris
  const colors = {
    gradientFrom: "from-gray-500",
    gradientTo: "to-gray-400",
    darkGradientFrom: "dark:from-gray-600",
    darkGradientTo: "dark:to-gray-500",
    iconBg: "bg-gray-100/80 text-gray-700 dark:bg-gray-800/60 dark:text-gray-300",
    headingText: "text-gray-800 dark:text-gray-200",
    descriptionText: "text-gray-600/90 dark:text-gray-300/80",
    lightBg: "from-white via-gray-50/40 to-gray-100/70",
    darkBg: "dark:from-gray-900 dark:via-gray-900/90 dark:to-gray-800/80",
    borderLight: "border-gray-100/70",
    borderDark: "dark:border-gray-800/20",
    separator: "via-gray-200/60 dark:via-gray-700/30"
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete();
  };

  const handleMarkAsSold = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onMarkAsSold();
  };

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent 
          side="bottom"
          className={cn(
            "px-0 py-0 rounded-t-xl",
            "border-t shadow-lg",
            colors.borderLight,
            colors.borderDark,
            "max-h-[90vh]",
            "dark:bg-gray-900"
          )}
        >
          <div className={cn(
            "absolute inset-x-0 top-0 h-1.5 w-12 mx-auto my-2",
            "bg-gray-300 dark:bg-gray-600 rounded-full"
          )} />

          <div 
            className={cn(
              "relative flex flex-col pb-6 pt-5 px-6",
              "bg-gradient-to-br",
              colors.lightBg,
              colors.darkBg
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Background gradient */}
            <div className={cn(
              "absolute inset-0 pointer-events-none opacity-5 bg-gradient-to-br rounded-t-lg",
              colors.gradientFrom,
              colors.gradientTo,
              colors.darkGradientFrom,
              colors.darkGradientTo
            )} />

            {/* Radial gradient */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-200 via-gray-100 to-transparent opacity-[0.015] dark:from-gray-500 dark:via-gray-600 dark:to-transparent dark:opacity-[0.01] rounded-t-lg" />
            
            {/* Dialog header */}
            <AlertDialogHeader className="relative z-10 mb-4">
              <div className="flex items-center gap-3">
                <div className={cn("p-2.5 rounded-lg", "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400")}>
                  <AlertTriangleIcon className="w-5 h-5" />
                </div>
                <AlertDialogTitle className={cn("text-2xl font-bold", colors.headingText)}>
                  Gestion du véhicule
                </AlertDialogTitle>
              </div>
              <div className="ml-[52px] mt-2">
                <AlertDialogDescription className={cn("text-base", colors.descriptionText)}>
                  Que souhaitez-vous faire avec ce véhicule ?
                </AlertDialogDescription>
              </div>
            </AlertDialogHeader>
            
            {/* Ligne séparatrice stylée */}
            <div className={cn(
              "h-px w-full mb-6",
              "bg-gradient-to-r from-transparent to-transparent",
              colors.separator
            )} />
            
            {/* Actions */}
            <AlertDialogFooter className="flex flex-col space-y-2 sm:space-y-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
                <Button
                  variant="outline"
                  onClick={handleMarkAsSold}
                  className="w-full"
                >
                  Marquer comme vendu
                </Button>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={handleDelete}
                >
                  Supprimer définitivement
                </AlertDialogAction>
              </div>
              <AlertDialogCancel className="mt-2 sm:mt-0">Annuler</AlertDialogCancel>
            </AlertDialogFooter>
            
            {/* Decorative icon */}
            <div className="absolute bottom-0 right-0 w-32 h-32 pointer-events-none opacity-[0.03] dark:opacity-[0.02]">
              <CarIcon className="w-full h-full" />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent 
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "p-0 overflow-hidden rounded-lg border",
          colors.borderLight,
          colors.borderDark,
          "dark:bg-gray-900"
        )}
      >
        <div 
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
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-200 via-gray-100 to-transparent opacity-[0.015] dark:from-gray-500 dark:via-gray-600 dark:to-transparent dark:opacity-[0.01] rounded-lg" />
          
          <AlertDialogHeader className="relative z-10 mb-4">
            <div className="flex items-center gap-3">
              <div className={cn("p-2.5 rounded-lg", "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400")}>
                <AlertTriangleIcon className="w-5 h-5" />
              </div>
              <AlertDialogTitle className={cn("text-2xl font-bold", colors.headingText)}>
                Gestion du véhicule
              </AlertDialogTitle>
            </div>
            <div className="ml-[52px] mt-2">
              <AlertDialogDescription className={cn("text-base", colors.descriptionText)}>
                Que souhaitez-vous faire avec ce véhicule ?
              </AlertDialogDescription>
            </div>
          </AlertDialogHeader>
          
          {/* Ligne séparatrice stylée */}
          <div className={cn(
            "h-px w-full mb-6",
            "bg-gradient-to-r from-transparent to-transparent",
            colors.separator
          )} />
          
          <AlertDialogFooter className="relative z-10 flex flex-col space-y-2 sm:space-y-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
              <Button
                variant="outline"
                onClick={handleMarkAsSold}
                className="w-full"
              >
                Marquer comme vendu
              </Button>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={handleDelete}
              >
                Supprimer définitivement
              </AlertDialogAction>
            </div>
            <AlertDialogCancel className="mt-2 sm:mt-0">Annuler</AlertDialogCancel>
          </AlertDialogFooter>
          
          {/* Decorative icon */}
          <div className="absolute bottom-0 right-0 w-32 h-32 pointer-events-none opacity-[0.03] dark:opacity-[0.02]">
            <CarIcon className="w-full h-full" />
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
