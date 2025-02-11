
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { formatCurrency } from "@/utils/format";

interface PropertyExpense {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
}

const CATEGORY_LABELS: Record<string, string> = {
  charges: "Charges",
  impots: "Impôts",
  travaux: "Travaux",
  assurance: "Assurance",
  autres: "Autres",
};

interface ExpensesListProps {
  expenses: PropertyExpense[];
}

export function ExpensesList({ expenses }: ExpensesListProps) {
  return (
    <Table>
      <TableCaption>Liste des dépenses</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Catégorie</TableHead>
          <TableHead>Description</TableHead>
          <TableHead className="text-right">Montant</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {expenses.map((expense) => (
          <TableRow key={expense.id}>
            <TableCell>
              {format(new Date(expense.date), "d MMMM yyyy", { locale: fr })}
            </TableCell>
            <TableCell>{CATEGORY_LABELS[expense.category] || expense.category}</TableCell>
            <TableCell>{expense.description}</TableCell>
            <TableCell className="text-right">{formatCurrency(expense.amount)}</TableCell>
          </TableRow>
        ))}
        {expenses.length === 0 && (
          <TableRow>
            <TableCell colSpan={4} className="text-center text-muted-foreground">
              Aucune dépense enregistrée
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
