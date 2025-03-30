
import { VehicleExpense } from "@/types/vehicle";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";
import { VehicleExpenseActions } from "./VehicleExpenseActions";
import { useState, useCallback } from "react";
import { EditVehicleExpenseDialog } from "./EditVehicleExpenseDialog";
import { useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

interface VehicleExpenseRecentListProps {
  expenses: VehicleExpense[];
  onDeleteExpense: (id: string) => void;
  vehicleId: string;
  onSuccess?: () => void;
  limit?: number;
  isLoading?: boolean;
}

export const VehicleExpenseRecentList = ({ 
  expenses, 
  onDeleteExpense, 
  vehicleId,
  onSuccess,
  limit = 5,
  isLoading = false
}: VehicleExpenseRecentListProps) => {
  // État pour le dialogue d'édition
  const [editExpense, setEditExpense] = useState<VehicleExpense | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  
  // Limiter le nombre d'éléments affichés
  const limitedExpenses = expenses.slice(0, limit);
  
  // Fonction pour formater le montant
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  // Fonction pour déterminer l'icône en fonction du type de dépense
  const getExpenseTypeIcon = (type: string) => {
    switch (type) {
      case 'carburant':
        return '⛽';
      case 'entretien':
        return '🔧';
      case 'assurance':
        return '🛡️';
      case 'amende':
        return '📝';
      case 'parking':
        return '🅿️';
      case 'peage':
        return '🛣️';
      default:
        return '💰';
    }
  };

  // Gérer la fermeture du dialogue d'édition et mise à jour
  const handleEditDialogClose = useCallback(() => {
    setIsEditDialogOpen(false);
    setEditExpense(null);
  }, []);
  
  // Callback de succès pour l'édition
  const handleEditSuccess = useCallback(() => {
    // Appel du callback de succès parent
    if (onSuccess) {
      onSuccess();
    }
    
    // Fermeture du dialogue
    handleEditDialogClose();
    
    // Force refresh des données
    queryClient.invalidateQueries({ 
      queryKey: ["vehicle-expenses", vehicleId],
      refetchType: 'all'
    });
  }, [onSuccess, handleEditDialogClose, queryClient, vehicleId]);
  
  // Gérer la suppression avec mise à jour
  const handleDelete = useCallback((id: string) => {
    onDeleteExpense(id);
    
    // Force refresh des données après suppression
    queryClient.invalidateQueries({ 
      queryKey: ["vehicle-expenses", vehicleId],
      refetchType: 'all'
    });
    
    if (onSuccess) {
      onSuccess();
    }
  }, [onDeleteExpense, onSuccess, queryClient, vehicleId]);

  // Ouvrir le dialogue d'édition avec la dépense sélectionnée
  const handleEditClick = useCallback((expense: VehicleExpense) => {
    setEditExpense(expense);
    setIsEditDialogOpen(true);
  }, []);
  
  // Gestion de la fermeture du dialogue
  const handleDialogOpenChange = useCallback((open: boolean) => {
    if (!open) {
      handleEditDialogClose();
    } else {
      setIsEditDialogOpen(open);
    }
  }, [handleEditDialogClose]);

  // Rendu des squelettes de chargement
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="hover:bg-muted/50">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
                <div>
                  <Skeleton className="h-5 w-16" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {limitedExpenses.length > 0 ? (
        <>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            {limitedExpenses.length < expenses.length ? 
              `${limitedExpenses.length} dépenses récentes sur ${expenses.length} au total` : 
              `${expenses.length} dépenses au total`}
          </h3>
          
          {limitedExpenses.map((expense) => (
            <Card key={expense.id} className="hover:bg-muted/50 transition-colors">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{getExpenseTypeIcon(expense.expense_type)}</div>
                    <div>
                      <h3 className="font-medium">{expense.expense_type.charAt(0).toUpperCase() + expense.expense_type.slice(1)}</h3>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(expense.date), 'dd MMMM yyyy', { locale: fr })}
                      </p>
                      {expense.mileage && (
                        <p className="text-xs text-muted-foreground">
                          {expense.mileage} km
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-bold">{formatAmount(expense.amount)}</p>
                      {expense.fuel_volume && (
                        <p className="text-xs text-muted-foreground">
                          {expense.fuel_volume} L {expense.fuel_volume > 0 ? `(${(expense.amount / expense.fuel_volume).toFixed(2)} €/L)` : ''}
                        </p>
                      )}
                    </div>
                    <VehicleExpenseActions
                      onEdit={() => handleEditClick(expense)}
                      onDelete={() => handleDelete(expense.id)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </>
      ) : (
        <div className="text-center p-8 border rounded-lg bg-muted/50">
          <p className="text-muted-foreground">Aucune dépense enregistrée pour ce véhicule.</p>
        </div>
      )}

      {/* Dialogue d'édition de dépense */}
      {editExpense && (
        <EditVehicleExpenseDialog
          open={isEditDialogOpen}
          onOpenChange={handleDialogOpenChange}
          expense={editExpense}
          vehicleId={vehicleId}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
};
