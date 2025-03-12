
import { TableHead, TableHeader as ShadcnTableHeader, TableRow } from "@/components/ui/table";
import { RecurringExpense } from "../types";
import { SortableTableHeader } from "@/components/properties/expenses/SortableTableHeader";
import { Calendar, Euro, Repeat, Tag } from "lucide-react";

interface TableHeaderProps {
  sortField: keyof RecurringExpense;
  sortDirection: "asc" | "desc";
  onSort: (field: keyof RecurringExpense) => void;
}

export const TableHeader = ({ 
  sortField, 
  sortDirection, 
  onSort 
}: TableHeaderProps) => {
  return (
    <ShadcnTableHeader>
      <TableRow>
        <SortableTableHeader
          field="name"
          label="Charge"
          currentSortField={sortField}
          sortDirection={sortDirection}
          onSort={onSort}
          icon={<Tag className="h-3.5 w-3.5 mr-1" />}
        />
        <SortableTableHeader
          field="category"
          label="Catégorie"
          currentSortField={sortField}
          sortDirection={sortDirection}
          onSort={onSort}
          icon={<Tag className="h-3.5 w-3.5 mr-1" />}
        />
        <SortableTableHeader
          field="periodicity"
          label="Périodicité"
          currentSortField={sortField}
          sortDirection={sortDirection}
          onSort={onSort}
          icon={<Repeat className="h-3.5 w-3.5 mr-1" />}
        />
        <SortableTableHeader
          field="amount"
          label="Montant"
          currentSortField={sortField}
          sortDirection={sortDirection}
          onSort={onSort}
          className="text-center"
          icon={<Euro className="h-3.5 w-3.5 mr-1" />}
        />
        <TableHead className="text-right"></TableHead>
      </TableRow>
    </ShadcnTableHeader>
  );
};
