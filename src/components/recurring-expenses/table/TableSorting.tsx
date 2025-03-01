
import { TableHead } from "@/components/ui/table";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { RecurringExpense } from "../types";
import { SortConfig } from "./tableUtils";
import { cn } from "@/lib/utils";

interface TableSortingProps {
  label: string;
  sortKey: keyof RecurringExpense;
  currentSort: SortConfig;
  onSort: (key: keyof RecurringExpense) => void;
  className?: string;
}

export const TableSorting = ({ 
  label, 
  sortKey, 
  currentSort, 
  onSort, 
  className 
}: TableSortingProps) => {
  const isSorted = currentSort.key === sortKey;
  
  return (
    <TableHead 
      className={cn("cursor-pointer hover:text-foreground transition-colors", className)}
      onClick={() => onSort(sortKey)}
    >
      <div className="flex items-center justify-between">
        <span>{label}</span>
        <span className="ml-2">
          {isSorted ? (
            currentSort.direction === 'asc' ? 
              <ArrowUp className="h-4 w-4" /> : 
              <ArrowDown className="h-4 w-4" />
          ) : (
            <ArrowUpDown className="h-4 w-4 opacity-50" />
          )}
        </span>
      </div>
    </TableHead>
  );
};
