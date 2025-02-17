
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpDown } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { RecurringExpense, RecurringExpenseTableProps, ALL_CATEGORIES, ALL_PERIODICITIES, periodicityLabels } from "./types";
import { formatDebitDate } from "./utils";
import { TableFilters } from "./TableFilters";
import { TableRowActions } from "./TableRowActions";

export const RecurringExpenseTable = ({ expenses, onDeleteExpense }: RecurringExpenseTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>(ALL_CATEGORIES);
  const [periodicityFilter, setPeriodicityFilter] = useState<string>(ALL_PERIODICITIES);
  const [sortField, setSortField] = useState<keyof RecurringExpense>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const uniqueCategories = Array.from(new Set(expenses.map(expense => expense.category)));

  const handleSort = (field: keyof RecurringExpense) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === ALL_CATEGORIES || expense.category === categoryFilter;
    const matchesPeriodicity = periodicityFilter === ALL_PERIODICITIES || expense.periodicity === periodicityFilter;
    return matchesSearch && matchesCategory && matchesPeriodicity;
  });

  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    const multiplier = sortDirection === "asc" ? 1 : -1;
    if (sortField === "amount") {
      return (a[sortField] - b[sortField]) * multiplier;
    }
    return String(a[sortField]).localeCompare(String(b[sortField])) * multiplier;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <TableFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          categoryFilter={categoryFilter}
          onCategoryFilterChange={setCategoryFilter}
          periodicityFilter={periodicityFilter}
          onPeriodicityFilterChange={setPeriodicityFilter}
          uniqueCategories={uniqueCategories}
        />
        <Select value={sortField} onValueChange={(value: keyof RecurringExpense) => handleSort(value)}>
          <SelectTrigger className="w-[180px]">
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

      <div className="space-y-2">
        <Table>
          <TableHeader>
            <TableRow className="border-0">
              <TableHead className="text-card-foreground dark:text-card-foreground">Nom</TableHead>
              <TableHead className="text-card-foreground dark:text-card-foreground">Catégorie</TableHead>
              <TableHead className="text-card-foreground dark:text-card-foreground">Périodicité</TableHead>
              <TableHead className="text-card-foreground dark:text-card-foreground">Prélèvement</TableHead>
              <TableHead className="text-card-foreground dark:text-card-foreground">Montant</TableHead>
              <TableHead className="text-card-foreground dark:text-card-foreground">Créé le</TableHead>
              <TableHead className="text-card-foreground dark:text-card-foreground text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="space-y-2">
            {sortedExpenses.map((expense) => (
              <TableRow 
                key={expense.id}
                className="border rounded-lg bg-card dark:bg-card hover:bg-accent/50 dark:hover:bg-accent/50 transition-colors"
              >
                <TableCell className="rounded-l-lg">{expense.name}</TableCell>
                <TableCell>{expense.category}</TableCell>
                <TableCell>{periodicityLabels[expense.periodicity]}</TableCell>
                <TableCell>{formatDebitDate(expense.debit_day, expense.debit_month, expense.periodicity)}</TableCell>
                <TableCell>{expense.amount.toLocaleString('fr-FR')} €</TableCell>
                <TableCell>{format(new Date(expense.created_at), 'dd/MM/yyyy', { locale: fr })}</TableCell>
                <TableCell className="rounded-r-lg text-right">
                  <TableRowActions expense={expense} onDeleteExpense={onDeleteExpense} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="text-sm text-muted-foreground">
        {filteredExpenses.length} résultat{filteredExpenses.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
};
