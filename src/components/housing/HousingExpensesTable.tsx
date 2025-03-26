
import { RecurringExpense } from "@/components/recurring-expenses/types";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/utils/format";
import { useHousing } from "@/hooks/useHousing";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import StyledLoader from "@/components/ui/StyledLoader";

interface HousingExpensesTableProps {
  expenses: (RecurringExpense & { property_relation_id?: string })[];
  isLoading: boolean;
  yearlyTotal: number;
}

export const HousingExpensesTable = ({ expenses, isLoading, yearlyTotal }: HousingExpensesTableProps) => {
  const { removeRecurringExpense } = useHousing();

  const handleRemoveExpense = async (relationId: string, expenseName: string) => {
    if (!relationId) {
      toast.error("Impossible de retirer cette charge");
      return;
    }

    if (window.confirm(`Êtes-vous sûr de vouloir retirer "${expenseName}" des charges de ce logement ?`)) {
      try {
        await removeRecurringExpense.mutateAsync(relationId);
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
      }
    }
  };

  if (isLoading) {
    return <StyledLoader />;
  }

  if (expenses.length === 0) {
    return (
      <div className="text-center py-10 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-muted-foreground">
          Aucune charge récurrente associée à ce logement.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Cliquez sur "Ajouter une charge" pour associer des dépenses à ce logement.
        </p>
      </div>
    );
  }

  const getYearlyAmount = (expense: RecurringExpense) => {
    switch (expense.periodicity) {
      case 'monthly': return expense.amount * 12;
      case 'quarterly': return expense.amount * 4;
      case 'yearly': return expense.amount;
      default: return expense.amount;
    }
  };

  const getPeriodicityLabel = (periodicity: string) => {
    switch (periodicity) {
      case 'monthly': return 'Mensuelle';
      case 'quarterly': return 'Trimestrielle';
      case 'yearly': return 'Annuelle';
      default: return periodicity;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Catégorie</TableHead>
            <TableHead>Périodicité</TableHead>
            <TableHead className="text-right">Montant</TableHead>
            <TableHead className="text-right">Montant annuel</TableHead>
            <TableHead className="w-10"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.map((expense) => (
            <TableRow key={expense.id}>
              <TableCell className="font-medium">{expense.name}</TableCell>
              <TableCell>{expense.category}</TableCell>
              <TableCell>{getPeriodicityLabel(expense.periodicity)}</TableCell>
              <TableCell className="text-right">{formatCurrency(expense.amount)}</TableCell>
              <TableCell className="text-right">{formatCurrency(getYearlyAmount(expense))}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveExpense(expense.property_relation_id || '', expense.name)}
                  title="Retirer cette charge"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4}>Total annuel</TableCell>
            <TableCell className="text-right font-bold">{formatCurrency(yearlyTotal)}</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};
