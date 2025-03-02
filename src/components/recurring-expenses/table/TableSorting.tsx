
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpDown } from "lucide-react";
import { RecurringExpense } from "../types";

interface TableSortingProps {
  rowsPerPage: number;
  onRowsPerPageChange: (value: number) => void;
  sortField: keyof RecurringExpense;
  onSortFieldChange: (value: keyof RecurringExpense) => void;
}

export const TableSorting = ({ rowsPerPage, onRowsPerPageChange, sortField, onSortFieldChange }: TableSortingProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
      <Select value={String(rowsPerPage)} onValueChange={(value) => onRowsPerPageChange(Number(value))}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Lignes par page"/>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="10">10 lignes</SelectItem>
          <SelectItem value="25">25 lignes</SelectItem>
          <SelectItem value="-1">Toutes les lignes</SelectItem>
        </SelectContent>
      </Select>
      <Select value={sortField} onValueChange={(value: keyof RecurringExpense) => onSortFieldChange(value)}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <ArrowUpDown className="mr-2 h-4 w-4" />
          <SelectValue placeholder="Trier par" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="name">Nom</SelectItem>
          <SelectItem value="amount">Montant</SelectItem>
          <SelectItem value="created_at">Date de création</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
