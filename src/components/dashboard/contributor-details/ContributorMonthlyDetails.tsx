
import { Card } from "@/components/ui/card";
import { PaginationControls } from "@/components/properties/expenses/PaginationControls";

interface ContributorMonthlyDetailsProps {
  expenses: Array<{
    id: string;
    name?: string;
    nom_credit?: string;
    category?: string;
    nom_domaine?: string;
    amount?: number;
    montant_mensualite?: number;
  }>;
  currentPage: number;
  totalPages: number;
  contributorPercentage: number;
  onPageChange: (page: number) => void;
  type?: "expense" | "credit";
}

export function ContributorMonthlyDetails({ 
  expenses, 
  currentPage, 
  totalPages,
  contributorPercentage,
  onPageChange,
  type = "expense"
}: ContributorMonthlyDetailsProps) {
  const isCredit = type === "credit";

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">
        {isCredit ? "Détails des crédits" : "Détails des charges"}
      </h3>
      <div className="space-y-4">
        {expenses.map((item) => {
          const name = isCredit ? item.nom_credit : item.name;
          const category = isCredit ? item.nom_domaine : item.category;
          const amount = isCredit ? item.montant_mensualite : item.amount;

          return (
            <div
              key={item.id}
              className="flex items-center justify-between p-2 rounded-lg border"
            >
              <div>
                <p className="font-medium">{name}</p>
                <p className="text-sm text-muted-foreground">{category}</p>
              </div>
              <p className="font-medium">
                {((amount || 0) * (contributorPercentage / 100)).toFixed(2)} €
              </p>
            </div>
          );
        })}
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
