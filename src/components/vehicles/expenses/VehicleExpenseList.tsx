
import { VehicleExpense } from "@/types/vehicle";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";
import { VehicleExpenseActions } from "./VehicleExpenseActions";
import { useState } from "react";
import { EditVehicleExpenseDialog } from "./EditVehicleExpenseDialog";

interface VehicleExpenseListProps {
  expenses: VehicleExpense[];
  onDeleteExpense: (id: string) => void;
  vehicleId: string;
}

export const VehicleExpenseList = ({ expenses, onDeleteExpense, vehicleId }: VehicleExpenseListProps) => {
  // État pour le dialogue d'édition
  const [editExpense, setEditExpense] = useState<VehicleExpense | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
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

  // Ouvrir le dialogue d'édition avec la dépense sélectionnée
  const handleEditClick = (expense: VehicleExpense) => {
    setEditExpense(expense);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      {expenses.map((expense) => (
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
                  onDelete={() => onDeleteExpense(expense.id)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Dialogue d'édition de dépense */}
      {editExpense && (
        <EditVehicleExpenseDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          expense={editExpense}
          vehicleId={vehicleId}
        />
      )}
    </div>
  );
};
