
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RecurringExpense, RecurringExpenseTableProps, ALL_CATEGORIES, ALL_PERIODICITIES } from "./types";
import { TableFilters } from "./TableFilters";
import { motion } from "framer-motion";
import { TableRows } from "./table/TableRows";
import { TablePagination } from "./table/TablePagination";
import { TableSorting } from "./table/TableSorting";
import { filterExpenses, sortExpenses, paginateExpenses } from "./table/tableUtils";

export const RecurringExpenseTable = ({ expenses, onDeleteExpense }: RecurringExpenseTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>(ALL_CATEGORIES);
  const [periodicityFilter, setPeriodicityFilter] = useState<string>(ALL_PERIODICITIES);
  const [sortField, setSortField] = useState<keyof RecurringExpense>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
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

  const handleRowsPerPageChange = (value: number) => {
    setRowsPerPage(value);
    setCurrentPage(1);
  };

  const filteredExpenses = filterExpenses(expenses, searchTerm, categoryFilter, periodicityFilter, ALL_CATEGORIES, ALL_PERIODICITIES);
  const sortedExpenses = sortExpenses(filteredExpenses, sortField, sortDirection);
  const totalPages = rowsPerPage === -1 ? 1 : Math.ceil(sortedExpenses.length / rowsPerPage);
  const paginatedExpenses = paginateExpenses(sortedExpenses, currentPage, rowsPerPage);

  return (
    <div className="space-y-4">
      <motion.div 
        className="flex flex-col gap-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between w-full">
          <TableFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            categoryFilter={categoryFilter}
            onCategoryFilterChange={setCategoryFilter}
            periodicityFilter={periodicityFilter}
            onPeriodicityFilterChange={setPeriodicityFilter}
            uniqueCategories={uniqueCategories}
          />
          <TableSorting 
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleRowsPerPageChange}
            sortField={sortField}
            onSortFieldChange={handleSort}
          />
        </div>
      </motion.div>

      <motion.div 
        className="overflow-auto rounded-lg border bg-background"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="relative w-full overflow-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-0">
                <TableHead className="text-card-foreground dark:text-card-foreground">Charge</TableHead>
                <TableHead className="text-card-foreground dark:text-card-foreground">Catégorie</TableHead>
                <TableHead className="text-card-foreground dark:text-card-foreground">Périodicité</TableHead>
                <TableHead className="text-card-foreground dark:text-card-foreground text-center">Montant</TableHead>
                <TableHead className="text-card-foreground dark:text-card-foreground text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRows 
                expenses={paginatedExpenses} 
                onDeleteExpense={onDeleteExpense} 
              />
            </TableBody>
          </Table>
        </div>
      </motion.div>

      <motion.div 
        className="flex flex-col sm:flex-row items-center justify-between gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <div className="text-sm text-muted-foreground order-2 sm:order-1">
          {filteredExpenses.length} résultat{filteredExpenses.length !== 1 ? 's' : ''}
        </div>
        <div className="order-1 sm:order-2">
          <TablePagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </motion.div>
    </div>
  );
};
