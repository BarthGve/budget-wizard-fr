import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { TrashIcon, ShoppingCart, AlertTriangle, X } from "lucide-react";
import { cn } from "@/lib/utils";

type VehicleDeleteDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: () => void;
  onMarkAsSold: () => void;
};

export const VehicleDeleteDialog = ({
  isOpen,
  onOpenChange,
  onDelete,
  onMarkAsSold,
}: VehicleDeleteDialogProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className={cn(
        "p-0 border-0 rounded-lg overflow-hidden max-w-md",
        "bg-gradient-to-br from-white to-gray-50",
        "dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800"
      )}
      style={{
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.04)",
        // Support pour le dark mode via CSS plutôt que style conditionnel
      }}>
        <AlertDialogHeader className={cn(
          "p-5 border-b",
          "border-gray-200/70",
          "dark:border-gray-700/50"
        )}>
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-lg",
              "bg-amber-100 text-amber-600", 
              "dark:bg-amber-900/30 dark:text-amber-300"
            )}>
              <AlertTriangle className="h-5 w-5" />
            </div>
            <AlertDialogTitle className={cn(
              "text-xl font-semibold",
              "text-gray-800",
              "dark:text-white"
            )}>
              Action sur le véhicule
            </AlertDialogTitle>
            
            <button 
              className={cn(
                "ml-auto rounded-full p-1.5 hover:bg-gray-200/20 transition-colors",
                "text-gray-500 hover:text-gray-800",
                "dark:text-gray-400 dark:hover:text-gray-200"
              )}
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Fermer</span>
            </button>
          </div>
          
          <AlertDialogDescription className={cn(
            "mt-3 ml-11",
            "text-gray-600",
            "dark:text-gray-300"
          )}>
            Que souhaitez-vous faire avec ce véhicule ?
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="p-5 space-y-4">
          <div className={cn(
            "p-4 rounded-lg",
            "bg-white border border-gray-200",
            "dark:bg-gray-800/70 dark:border-gray-700"
          )}>
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-lg flex-shrink-0",
                "bg-blue-100 text-blue-600",
                "dark:bg-blue-900/30 dark:text-blue-300"
              )}>
                <ShoppingCart className="h-5 w-5" />
              </div>
              <div>
                <h3 className={cn(
                  "font-medium",
                  "text-gray-800",
                  "dark:text-gray-200"
                )}>
                  Marquer comme vendu
                </h3>
                <p className={cn(
                  "text-sm",
                  "text-gray-500",
                  "dark:text-gray-400"
                )}>
                  Le véhicule sera archivé mais conservé dans l'historique
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              className={cn(
                "mt-3 w-full justify-center",
                "border-blue-500 text-blue-600 hover:bg-blue-50 hover:text-blue-700",
                "dark:bg-blue-900/30 dark:border-blue-700/50 dark:text-blue-300 dark:hover:bg-blue-800/50 dark:hover:text-blue-200"
              )}
              onClick={() => {
                onMarkAsSold();
                onOpenChange(false);
              }}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Marquer comme vendu
            </Button>
          </div>
          
          <div className={cn(
            "p-4 rounded-lg",
            "bg-white border border-gray-200",
            "dark:bg-gray-800/70 dark:border-gray-700"
          )}>
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-lg flex-shrink-0",
                "bg-red-100 text-red-600",
                "dark:bg-red-900/30 dark:text-red-300"
              )}>
                <TrashIcon className="h-5 w-5" />
              </div>
              <div>
                <h3 className={cn(
                  "font-medium",
                  "text-gray-800",
                  "dark:text-gray-200"
                )}>
                  Supprimer définitivement
                </h3>
                <p className={cn(
                  "text-sm",
                  "text-gray-500",
                  "dark:text-gray-400"
                )}>
                  Cette action est irréversible et supprimera toutes les données
                </p>
              </div>
            </div>
            <Button
              variant="destructive"
              className={cn(
                "mt-3 w-full justify-center",
                "bg-red-600 hover:bg-red-700",
                "dark:bg-red-900/50 dark:hover:bg-red-800/70"
              )}
              onClick={() => {
                onDelete();
                onOpenChange(false);
              }}
            >
              <TrashIcon className="mr-2 h-4 w-4" />
              Supprimer définitivement
            </Button>
          </div>
        </div>
        
        <AlertDialogFooter className={cn(
          "p-5 border-t flex-col sm:flex-row gap-2 justify-center sm:justify-end",
          "border-gray-200/70",
          "dark:border-gray-700/50"
        )}>
          <AlertDialogCancel className={cn(
            "mt-0",
            "bg-gray-100 hover:bg-gray-200 text-gray-700",
            "dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 dark:text-gray-300"
          )}>
            Annuler
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
