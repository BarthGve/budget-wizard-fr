
import { Card } from "@/components/ui/card";
import { PaginationControls } from "@/components/properties/expenses/PaginationControls";

interface ContributorMonthlyDetailsProps {
  expenses: Array<{
    id: string;
    name: string;
    category: string;
    amount: number;
  }>;
  currentPage: number;
  totalPages: number;
  contributorPercentage: number;
  onPageChange: (page: number) => void;
}

export function ContributorMonthlyDetails({ 
  expenses, 
  currentPage, 
  totalPages,
  contributorPercentage,
  onPageChange 
}: ContributorMonthlyDetailsProps) {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Détails du mois en cours</h3>
      <div className="space-y-4">
        {expenses.map((expense) => (
          <div
            key={expense.id}
            className="flex items-center justify-between p-2 rounded-lg border"
          >
            <div>
              <p className="font-medium">{expense.name}</p>
              <p className="text-sm text-muted-foreground">{expense.category}</p>
            </div>
            <p className="font-medium">
              {(expense.amount * (contributorPercentage / 100)).toFixed(2)} €
            </p>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </Card>
  );
}
