
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RecurringExpense } from "./types";
import { TableRows } from "./table/TableRows";
import { useState } from "react";
import { TablePagination } from "./table/TablePagination";
import { TableSorting } from "./table/TableSorting";
import { SortConfig, filterAndSortExpenses } from "./table/tableUtils";
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
  const [filterText, setFilterText] = useState("");
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'name', direction: 'asc' });

  // Effectuer le filtrage et le tri
  const filteredAndSortedExpenses = filterAndSortExpenses(expenses, filterText, filterCategory, sortConfig);
  
  // Calculer les éléments à afficher sur la page actuelle
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAndSortedExpenses.slice(indexOfFirstItem, indexOfLastItem);
  
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
  
  if (!filteredAndSortedExpenses) {
    return <CardLoader />;
  }

  return (
    <Card className="p-1">
      <TableFilters 
        onFilterTextChange={setFilterText} 
        filterText={filterText}
        onFilterCategoryChange={setFilterCategory}
        filterCategory={filterCategory}
        categories={Array.from(new Set(expenses.map(expense => expense.category)))}
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
              expenses={currentItems} 
              onDeleteExpense={onDeleteExpense} 
              isFirstVisit={isFirstVisit}
            />
          </TableBody>
        </Table>
      </div>
      
      <TablePagination 
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalItems={filteredAndSortedExpenses.length}
        onPageChange={handlePageChange}
        onItemsPerPageChange={setItemsPerPage}
      />
    </Card>
  );
};
