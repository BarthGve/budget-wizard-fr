
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RecurringExpense, RecurringExpenseTableProps, ALL_CATEGORIES, ALL_PERIODICITIES, periodicityLabels } from "./types";
import { TableFilters } from "./TableFilters";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { TableRows } from "./table/TableRows";
import { TablePagination } from "./table/TablePagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { filterExpenses, sortExpenses, paginateExpenses } from "./table/tableUtils";
import { SortableTableHeader } from "@/components/properties/expenses/SortableTableHeader";

export const RecurringExpenseTable = ({ expenses, onDeleteExpense }: RecurringExpenseTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>(ALL_CATEGORIES);
  const [periodicityFilter, setPeriodicityFilter] = useState<string>(ALL_PERIODICITIES);
  const [sortField, setSortField] = useState<keyof RecurringExpense>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState(1);

  const uniqueCategories = Array.from(new Set(expenses.map(expense => expense.category)));

  const handleSort = (field: keyof RecurringExpense) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredExpenses = filterExpenses(expenses, searchTerm, categoryFilter, periodicityFilter, ALL_CATEGORIES, ALL_PERIODICITIES);
  const sortedExpenses = sortExpenses(filteredExpenses, sortField, sortDirection);
  const totalPages = itemsPerPage === -1 ? 1 : Math.ceil(sortedExpenses.length / itemsPerPage);
  const paginatedExpenses = paginateExpenses(sortedExpenses, currentPage, itemsPerPage);

  if (expenses.length === 0) {
    return (
      <p className="text-center py-8 text-muted-foreground">
        Aucune charge récurrente enregistrée
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <motion.div 
        className="flex flex-col gap-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <TableFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          categoryFilter={categoryFilter}
          onCategoryFilterChange={setCategoryFilter}
          periodicityFilter={periodicityFilter}
          onPeriodicityFilterChange={setPeriodicityFilter}
          uniqueCategories={uniqueCategories}
        />
      </motion.div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          {filteredExpenses.length} charge{filteredExpenses.length !== 1 ? 's' : ''} au total
        </div>
        <Select value={String(itemsPerPage)} onValueChange={(value) => {
          setItemsPerPage(Number(value));
          setCurrentPage(1);
        }}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Lignes par page" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10 par page</SelectItem>
            <SelectItem value="25">25 par page</SelectItem>
            <SelectItem value="-1">Tout afficher</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <SortableTableHeader
                field="name"
                label="Charge"
                currentSortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              />
              <SortableTableHeader
                field="category"
                label="Catégorie"
                currentSortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              />
              <SortableTableHeader
                field="periodicity"
                label="Périodicité"
                currentSortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              />
              <SortableTableHeader
                field="amount"
                label="Montant"
                currentSortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
                className="text-center"
              />
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedExpenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell className="py-2">
                  <div className="flex items-center gap-3">
                    {expense.logo_url && (
                      <img
                        src={expense.logo_url}
                        alt={expense.name}
                        className="w-8 h-8 rounded-full object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder.svg";
                        }}
                      />
                    )}
                    <span className="font-semibold">{expense.name}</span>
                  </div>
                </TableCell>
                <TableCell className="py-2">{expense.category}</TableCell>
                <TableCell className="py-2">{periodicityLabels[expense.periodicity]}</TableCell>
                <TableCell className="text-center py-2 font-medium">{expense.amount.toLocaleString('fr-FR')} €</TableCell>
                <TableCell className="text-right py-2">
                  <div className="flex justify-end">
            



                    <button
                     variant="ghost"
                size="icon"
                      onClick={() => onDeleteExpense(expense.id)}
                      className="h-8 w-8 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                      >
                <Trash2 className="h-4 w-4" />
                </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};
