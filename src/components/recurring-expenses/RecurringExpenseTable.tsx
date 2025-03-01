
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RecurringExpense, ALL_CATEGORIES, ALL_PERIODICITIES } from "./types";
import { TableRows } from "./table/TableRows";
import { useState } from "react";
import { TablePagination } from "./table/TablePagination";
import { TableSorting } from "./table/TableSorting";
import { SortConfig, filterExpenses, sortExpenses, paginateExpenses } from "./table/tableUtils";
import { TableFilters } from "./TableFilters";
import { Card } from "@/components/ui/card";
import CardLoader from "../ui/cardloader";

interface RecurringExpenseTableProps {
  expenses: RecurringExpense[];
  onDeleteExpense: (id: string) => Promise<void>;
  isFirstVisit?: boolean;
}

export const RecurringExpenseTable = ({ 
  expenses, 
  onDeleteExpense,
  isFirstVisit = true 
}: RecurringExpenseTableProps) => {
  // États pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // États pour le filtre et le tri
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState(ALL_CATEGORIES);
  const [periodicityFilter, setPeriodicityFilter] = useState(ALL_PERIODICITIES);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'name', direction: 'asc' });

  // Extraire les catégories uniques
  const uniqueCategories = Array.from(new Set(expenses.map(expense => expense.category)));

  // Effectuer le filtrage, le tri et la pagination
  const filteredExpenses = filterExpenses(
    expenses, 
    searchTerm, 
    categoryFilter, 
    periodicityFilter,
    ALL_CATEGORIES, 
    ALL_PERIODICITIES
  );
  
  const sortedExpenses = sortExpenses(
    filteredExpenses,
    sortConfig.key,
    sortConfig.direction
  );
  
  const paginatedExpenses = paginateExpenses(
    sortedExpenses,
    currentPage,
    itemsPerPage
  );
  
  // Callback pour changer de page
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  
  // Callback pour changer le tri
  const handleSort = (key: keyof RecurringExpense) => {
    setSortConfig(prevSortConfig => {
      if (prevSortConfig.key === key) {
        return {
          key,
          direction: prevSortConfig.direction === 'asc' ? 'desc' : 'asc'
        };
      }
      return { key, direction: 'asc' };
    });
  };
  
  if (!expenses || expenses.length === 0) {
    return (
      <Card className="p-4 flex justify-center items-center min-h-[15rem]">
        <p className="text-muted-foreground">Aucune charge récurrente pour le moment.</p>
      </Card>
    );
  }
  
  if (!filteredExpenses) {
    return <CardLoader />;
  }

  return (
    <Card className="p-1">
      <TableFilters 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        periodicityFilter={periodicityFilter}
        onPeriodicityFilterChange={setPeriodicityFilter}
        uniqueCategories={uniqueCategories}
      />
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableSorting 
                label="Nom" 
                sortKey="name" 
                currentSort={sortConfig} 
                onSort={handleSort} 
              />
              <TableSorting 
                label="Catégorie" 
                sortKey="category" 
                currentSort={sortConfig} 
                onSort={handleSort} 
              />
              <TableSorting 
                label="Périodicité" 
                sortKey="periodicity" 
                currentSort={sortConfig} 
                onSort={handleSort} 
              />
              <TableSorting 
                label="Montant" 
                sortKey="amount" 
                currentSort={sortConfig}
                onSort={handleSort}
                className="text-center"
              />
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRows 
              expenses={paginatedExpenses} 
              onDeleteExpense={onDeleteExpense} 
              isFirstVisit={isFirstVisit}
            />
          </TableBody>
        </Table>
      </div>
      
      <TablePagination 
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalItems={filteredExpenses.length}
        onPageChange={handlePageChange}
        onItemsPerPageChange={setItemsPerPage}
      />
    </Card>
  );
};
