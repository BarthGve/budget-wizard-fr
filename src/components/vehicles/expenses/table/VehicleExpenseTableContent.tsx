
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { VehicleExpense } from "@/types/vehicle";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { VehicleExpenseTableActions } from "./VehicleExpenseTableActions";
import { formatCurrency } from "@/utils/format";
import { cn } from "@/lib/utils";
import { useVehicleExpenseTable } from "./useVehicleExpenseTable";
import { SortableTableHeader } from "@/components/properties/expenses/SortableTableHeader";

interface VehicleExpenseTableContentProps {
  expenseTable: ReturnType<typeof useVehicleExpenseTable>;
  onEditClick: (expense: VehicleExpense) => void;
}

// Fonction pour obtenir le label du type de dépense
const getExpenseTypeLabel = (type: string): string => {
  const typeLabels: Record<string, string> = {
    carburant: "Carburant",
    entretien: "Entretien",
    assurance: "Assurance",
    amende: "Amende",
    parking: "Parking",
    peage: "Péage",
    autres: "Autres"
  };
  
  return typeLabels[type] || type.charAt(0).toUpperCase() + type.slice(1);
};

export const VehicleExpenseTableContent = ({ 
  expenseTable,
  onEditClick
}: VehicleExpenseTableContentProps) => {
  const { 
    paginatedExpenses,
    sortField,
    sortDirection,
    handleSort,
    onDeleteExpense
  } = expenseTable;

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-gray-50 dark:bg-gray-900">
          <SortableTableHeader
            field="date"
            label="Date"
            currentSortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
          <SortableTableHeader
            field="expense_type"
            label="Type"
            currentSortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
          <SortableTableHeader
            field="amount"
            label="Montant"
            currentSortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
            className="text-center"
          />
          <SortableTableHeader
            field="mileage"
            label="Kilométrage"
            currentSortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
            className="text-center"
          />
          {/* Colonne conditionnelle pour les détails du carburant */}
          <SortableTableHeader
            field="fuel_volume"
            label="Volume"
            currentSortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
            className="text-center"
          />
          <SortableTableHeader
            field="comment"
            label="Commentaire"
            currentSortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
          <TableHead className="w-[100px] text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {paginatedExpenses.map((expense, index) => (
          <TableRow key={expense.id} className={cn(
            "transition-colors",
            index % 2 === 0 ? "bg-white dark:bg-gray-950" : "bg-gray-50/50 dark:bg-gray-900/20"
          )}>
            <TableCell className="py-2">
              {format(new Date(expense.date), "dd MMM yyyy", { locale: fr })}
            </TableCell>
            <TableCell className="py-2">
              {getExpenseTypeLabel(expense.expense_type)}
            </TableCell>
            <TableCell className="py-2 text-center font-medium">
              {formatCurrency(expense.amount)}
            </TableCell>
            <TableCell className="py-2 text-center">
              {expense.mileage ? `${expense.mileage} km` : "-"}
            </TableCell>
            <TableCell className="py-2 text-center">
              {expense.fuel_volume ? (
                <div>
                  <div>{expense.fuel_volume} L</div>
                  {expense.fuel_volume > 0 && (
                    <div className="text-xs text-muted-foreground">
                      {(expense.amount / expense.fuel_volume).toFixed(2)} €/L
                    </div>
                  )}
                </div>
              ) : "-"}
            </TableCell>
            <TableCell className="py-2 max-w-[200px] truncate">
              {expense.comment || "-"}
            </TableCell>
            <TableCell className="py-2 text-right">
              <VehicleExpenseTableActions
                onEdit={() => onEditClick(expense)}
                onDelete={() => onDeleteExpense(expense.id)}
              />
            </TableCell>
          </TableRow>
        ))}

        {paginatedExpenses.length === 0 && (
          <TableRow>
            <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
              Aucune dépense trouvée avec les filtres actuels
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
