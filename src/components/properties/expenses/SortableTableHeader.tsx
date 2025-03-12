
import { TableHead } from "@/components/ui/table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SortableTableHeaderProps<T> {
  field: keyof T;
  label: string;
  currentSortField: keyof T;
  sortDirection: "asc" | "desc";
  onSort: (field: keyof T) => void;
  className?: string;
  icon?: ReactNode;
}

export function SortableTableHeader<T>({
  field,
  label,
  currentSortField,
  sortDirection,
  onSort,
  className,
  icon
}: SortableTableHeaderProps<T>) {
  const isActive = currentSortField === field;
  
  return (
    <TableHead className={className}>
      <Button 
        variant="ghost" 
        size="sm" 
        className={cn(
          "p-0 hover:bg-transparent flex items-center gap-1", 
          isActive ? "text-blue-700 dark:text-blue-400" : "text-muted-foreground"
        )}
        onClick={() => onSort(field)}
      >
        {icon}
        {label}
        {isActive && (
          <ArrowUpDown className="ml-1 h-3 w-3 text-blue-400 dark:text-blue-500" />
        )}
      </Button>
    </TableHead>
  );
}
