
import { VehicleExpense } from "@/types/vehicle";
import { useState, useCallback, useEffect } from "react";
import { EditVehicleExpenseDialog } from "../EditVehicleExpenseDialog";
import { useVehicleExpenseTable } from "./useVehicleExpenseTable";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TableIcon } from "lucide-react";
import { VehicleExpenseTableContent } from "./VehicleExpenseTableContent";
import { VehicleExpenseTableFilters } from "./VehicleExpenseTableFilters";
import { VehicleExpenseTablePagination } from "./VehicleExpenseTablePagination";

interface VehicleExpenseTableProps {
  expenses: VehicleExpense[];
  onDeleteExpense: (id: string) => void;
  vehicleId: string;
  onSuccess?: () => void;
}

export const VehicleExpenseTable = ({ 
  expenses, 
  onDeleteExpense, 
  vehicleId,
  onSuccess 
}: VehicleExpenseTableProps) => {
  // État pour le dialogue d'édition
  const [editExpense, setEditExpense] = useState<VehicleExpense | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  // Utilisation du hook personnalisé pour gérer le tableau
  const expenseTable = useVehicleExpenseTable(expenses, onDeleteExpense);
  
  // Fonction memoïsée pour gérer la suppression en toute sécurité
  const handleDeleteExpense = useCallback((id: string) => {
    // Appeler la fonction de suppression fournie par les props
    onDeleteExpense(id);
    
    // Appeler le callback de succès si fourni
    if (onSuccess) {
      setTimeout(() => onSuccess(), 300); // Petit délai pour laisser le temps à la requête de se terminer
    }
  }, [onDeleteExpense, onSuccess]);
  
  // Gérer la fermeture du dialogue d'édition et nettoyer l'état
  const handleEditDialogClose = useCallback(() => {
    setIsEditDialogOpen(false);
    // Petit délai avant de nettoyer l'état pour éviter des problèmes de rendu
    setTimeout(() => setEditExpense(null), 300);
  }, []);
  
  // Ouvrir le dialogue d'édition avec la dépense sélectionnée
  const handleEditClick = useCallback((expense: VehicleExpense) => {
    setEditExpense(expense);
    setIsEditDialogOpen(true);
  }, []);
  
  // Callback de succès pour l'édition
  const handleEditSuccess = useCallback(() => {
    // Fermeture du dialogue
    handleEditDialogClose();
    
    // Appel du callback de succès parent après un délai
    if (onSuccess) {
      setTimeout(() => onSuccess(), 300);
    }
  }, [onSuccess, handleEditDialogClose]);
  
  // Gestion de la fermeture du dialogue avec nettoyage sécurisé
  const handleDialogOpenChange = useCallback((open: boolean) => {
    if (!open) {
      handleEditDialogClose();
    } else {
      setIsEditDialogOpen(open);
    }
  }, [handleEditDialogClose]);
  
  // Nettoyage des états lors du démontage du composant
  useEffect(() => {
    return () => {
      setEditExpense(null);
      setIsEditDialogOpen(false);
    };
  }, []);
  
  // Mise à jour du handler de suppression dans expenseTable
  useEffect(() => {
    expenseTable.onDeleteExpense = handleDeleteExpense;
  }, [expenseTable, handleDeleteExpense]);

  return (
    <Card className={cn(
      "border shadow-sm overflow-hidden relative",
      // Light mode
      "bg-white border-gray-100",
      // Dark mode
      "dark:bg-gray-800/90 dark:border-gray-800/50"
    )}>
      <div className={cn(
        "absolute inset-0 opacity-5",
        // Light mode
        "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-400 via-gray-300 to-transparent",
        // Dark mode
        "dark:opacity-10 dark:from-gray-400 dark:via-gray-500 dark:to-transparent"
      )} />

      <CardHeader className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div>
            <CardTitle className={cn(
              "text-xl font-semibold flex items-center gap-2",
              // Light mode
              "text-gray-700",
              // Dark mode
              "dark:text-gray-300"
            )}>
              <div className={cn(
                "p-1.5 rounded",
                // Light mode
                "bg-gray-100",
                // Dark mode
                "dark:bg-gray-800/40"
              )}>
                <TableIcon className={cn(
                  "h-5 w-5",
                  // Light mode
                  "text-gray-600",
                  // Dark mode
                  "dark:text-gray-400"
                )} />
              </div>
              Tableau des dépenses
            </CardTitle>
            <CardDescription className={cn(
              "mt-1 text-sm",
              // Light mode
              "text-gray-600/80",
              // Dark mode
              "dark:text-gray-400/90"
            )}>
              Consultez et gérez l'ensemble des dépenses du véhicule
            </CardDescription>
          </div>
          
          <VehicleExpenseTableFilters 
            expenseTable={expenseTable}
            className={cn(
              // Light mode
              "border-gray-200 bg-gray-50/50 text-gray-700",
              // Dark mode
              "dark:border-gray-800/70 dark:bg-gray-900/20 dark:text-gray-300"
            )}
          />
        </div>
      </CardHeader>
      
      <CardContent className="relative z-10 p-0 overflow-x-auto">
        <div className={cn(
          "border-t border-b",
          // Light mode
          "border-gray-100",
          // Dark mode
          "dark:border-gray-800/50"
        )}>
          <VehicleExpenseTableContent 
            expenseTable={expenseTable}
            onEditClick={handleEditClick}
          />
        </div>
      </CardContent>

      {expenseTable.totalPages > 1 && (
        <CardFooter className={cn(
          "justify-center py-4 relative z-10",
          // Light mode
          "bg-gray-50/30",
          // Dark mode
          "dark:bg-gray-900/10"
        )}>
          <VehicleExpenseTablePagination
            currentPage={expenseTable.currentPage}
            totalPages={expenseTable.totalPages}
            onPageChange={expenseTable.setCurrentPage}
          />
        </CardFooter>
      )}

      {/* Dialogue d'édition de dépense avec gestion sécurisée de l'état */}
      {editExpense && (
        <EditVehicleExpenseDialog
          key={`edit-dialog-${editExpense.id}`} // Clé unique pour forcer un nouveau montage
          open={isEditDialogOpen}
          onOpenChange={handleDialogOpenChange}
          expense={editExpense}
          vehicleId={vehicleId}
          onSuccess={handleEditSuccess}
        />
      )}
    </Card>
  );
};
