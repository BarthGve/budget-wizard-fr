
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RecurringExpense } from "../types";
import { SortableTableHeader } from "@/components/properties/expenses/SortableTableHeader";

interface TableHeaderProps {
  sortField: keyof RecurringExpense;
  sortDirection: "asc" | "desc";
  onSort: (field: keyof RecurringExpense) => void;
}

export const ExpenseTableHeader = ({ 
  sortField, 
  sortDirection, 
  onSort 
}: TableHeaderProps) => {
  return (
    <TableHeader>
      <TableRow>
        <SortableTableHeader
          field="name"
          label="Charge"
          currentSortField={sortField}
          sortDirection={sortDirection}
          onSort={onSort}
        />
        <SortableTableHeader
          field="category"
          label="Catégorie"
          currentSortField={sortField}
          sortDirection={sortDirection}
          onSort={onSort}
        />
        <SortableTableHeader
          field="periodicity"
          label="Périodicité"
          currentSortField={sortField}
          sortDirection={sortDirection}
          onSort={onSort}
        />
        <SortableTableHeader
          field="amount"
          label="Montant"
          currentSortField={sortField}
          sortDirection={sortDirection}
          onSort={onSort}
          className="text-center"
        />
        <TableHead className="text-right"></TableHead>
      </TableRow>
    </TableHeader>
  );
};
