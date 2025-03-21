import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { TrashIcon, ShoppingCart, AlertTriangle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

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
  const { theme } = useTheme();
  const isDarkTheme = theme === "dark";
  
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className={cn(
        "p-0 border-0 rounded-lg overflow-hidden max-w-md",
        isDarkTheme
          ? "bg-gradient-to-br from-gray-900 to-gray-800"
          : "bg-gradient-to-br from-white to-gray-50"
      )}
      style={{
        boxShadow: isDarkTheme 
          ? "0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.4)"
          : "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.04)"
      }}>
        <AlertDialogHeader className={cn(
          "p-5 border-b",
          isDarkTheme ? "border-gray-700/50" : "border-gray-200/70"
        )}>
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-lg",
              isDarkTheme 
                ? "bg-amber-900/30 text-amber-300" 
                : "bg-amber-100 text-amber-600"
            )}>
              <AlertTriangle className="h-5 w-5" />
            </div>
            <AlertDialogTitle className={cn(
              "text-xl font-semibold",
              isDarkTheme ? "text-white" : "text-gray-800"
            )}>
              Action sur le véhicule
            </AlertDialogTitle>
            
            <button 
              className={cn(
                "ml-auto rounded-full p-1.5 hover:bg-gray-200/20 transition-colors",
                isDarkTheme ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-800"
              )}
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Fermer</span>
            </button>
          </div>
          
          <AlertDialogDescription className={cn(
            "mt-3 ml-11",
            isDarkTheme ? "text-gray-300" : "text-gray-600"
          )}>
            Que souhaitez-vous faire avec ce véhicule ?
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="p-5 space-y-4">
          <div className={cn(
            "p-4 rounded-lg",
            isDarkTheme ? "bg-gray-800/70 border border-gray-700" : "bg-white border border-gray-200"
          )}>
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-lg flex-shrink-0",
                isDarkTheme ? "bg-blue-900/30 text-blue-300" : "bg-blue-100 text-blue-600"
              )}>
                <ShoppingCart className="h-5 w-5" />
              </div>
              <div>
                <h3 className={cn(
                  "font-medium",
                  isDarkTheme ? "text-gray-200" : "text-gray-800"
                )}>
                  Marquer comme vendu
                </h3>
                <p className={cn(
                  "text-sm",
                  isDarkTheme ? "text-gray-400" : "text-gray-500"
                )}>
                  Le véhicule sera archivé mais conservé dans l'historique
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              className={cn(
                "mt-3 w-full justify-center",
                isDarkTheme 
                  ? "bg-blue-900/30 border-blue-700/50 text-blue-300 hover:bg-blue-800/50 hover:text-blue-200" 
                  : "border-blue-500 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
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
            isDarkTheme ? "bg-gray-800/70 border border-gray-700" : "bg-white border border-gray-200"
          )}>
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-lg flex-shrink-0",
                isDarkTheme ? "bg-red-900/30 text-red-300" : "bg-red-100 text-red-600"
              )}>
                <TrashIcon className="h-5 w-5" />
              </div>
              <div>
                <h3 className={cn(
                  "font-medium",
                  isDarkTheme ? "text-gray-200" : "text-gray-800"
                )}>
                  Supprimer définitivement
                </h3>
                <p className={cn(
                  "text-sm",
                  isDarkTheme ? "text-gray-400" : "text-gray-500"
                )}>
                  Cette action est irréversible et supprimera toutes les données
                </p>
              </div>
            </div>
            <Button
              variant="destructive"
              className={cn(
                "mt-3 w-full justify-center",
                isDarkTheme 
                  ? "bg-red-900/50 hover:bg-red-800/70" 
                  : "bg-red-600 hover:bg-red-700"
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
          isDarkTheme ? "border-gray-700/50" : "border-gray-200/70"
        )}>
          <AlertDialogCancel className={cn(
            "mt-0",
            isDarkTheme
              ? "bg-gray-800 border-gray-700 hover:bg-gray-700 text-gray-300"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          )}>
            Annuler
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
