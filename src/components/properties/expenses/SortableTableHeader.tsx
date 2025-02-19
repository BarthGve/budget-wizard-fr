
import { TableHead } from "@/components/ui/table";
import { ChevronUp, ChevronDown } from "lucide-react";

interface SortableTableHeaderProps {
  field: string;
  label: string;
  currentSortField: string;
  sortDirection: "asc" | "desc";
  onSort: (field: string) => void;
  className?: string;
}

export function SortableTableHeader({
  field,
  label,
  currentSortField,
  sortDirection,
  onSort,
  className
}: SortableTableHeaderProps) {
  const SortIcon = () => {
    if (field !== currentSortField) return null;
    return sortDirection === "asc" ? (
      <ChevronUp className="h-4 w-4 inline ml-1" />
    ) : (
      <ChevronDown className="h-4 w-4 inline ml-1" />
    );
  };

  return (
    <TableHead
      className={`cursor-pointer hover:text-primary transition-colors ${className}`}
      onClick={() => onSort(field)}
    >
      {label} <SortIcon />
    </TableHead>
  );
}
