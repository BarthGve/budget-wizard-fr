
import { TableHeader } from "./TableHeader";
import { ExpenseTableRows } from "./ExpenseTableRows";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TableIcon } from "lucide-react";
import { Table } from "@/components/ui/table";
import { TableFilters } from "../TableFilters";
import { ItemsPerPageSelect } from "./ItemsPerPageSelect";
import { TablePagination } from "./TablePagination";
import { TableDialogs } from "./TableDialogs";
import { useTheme } from "next-themes";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { RecurringExpense } from "../types";

// Type pour les props du composant
interface ExpenseTableContentProps {
  expenseTable: ReturnType<typeof import("../hooks/useExpenseTable").useExpenseTable>;
}

export const ExpenseTableContent = ({ expenseTable }: ExpenseTableContentProps) => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  const {
    searchTerm,
    categoryFilter,
    sortField,
    sortDirection,
    currentPage,
    totalPages,
    expenseToDelete,
    selectedExpense,
    showEditDialog,
    showDetailsDialog,
    uniqueCategories,
    filteredExpenses,
    paginatedExpenses,
    allExpenses,
    setSearchTerm,
    setCategoryFilter,
    setCurrentPage,
    setExpenseToDelete,
    setShowEditDialog,
    setShowDetailsDialog,
    handleSort,
    handleDeleteClick,
    handleEditClick,
    handleViewDetails,
    handleItemsPerPageChange,
    itemsPerPage,
    onDeleteExpense
  } = expenseTable;

  return (
    <Card className={cn(
      "border shadow-sm overflow-hidden relative w-full max-w-full",
      // Light mode
      "bg-white border-tertiary-100",
      // Dark mode
      "dark:bg-gray-800/90 dark:border-tertiary-800/50"
    )}>
    

      <CardHeader className="relative z-10">
        <div className={cn(
          "flex justify-between items-start mb-4",
          isMobile && "flex-col gap-3"
        )}>
          <div>
            <CardTitle className={cn(
              "text-xl font-semibold flex items-center gap-2",
          
            )}>
              <div className={cn(
                "p-1.5 rounded",
                // Light mode
                "bg-tertiary-100",
                // Dark mode
                "dark:bg-tertiary-800/40"
              )}>
                <TableIcon className={cn(
                  "h-5 w-5",
                  // Light mode
                  "text-tertiary-600",
                  // Dark mode
                  "dark:text-tertiary-400"
                )} />
              </div>
              Listing
            </CardTitle>
            <CardDescription className={cn(
              "mt-1 text-sm",
              // Light mode
              "text-tertiary-600/80",
              // Dark mode
              "dark:text-tertiary-400/90"
            )}>
              Consultez et gérez l'ensemble de vos dépenses récurrentes
            </CardDescription>
          </div>
          
          <ItemsPerPageSelect 
            itemsPerPage={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className={cn(
              // Light mode
              "border-tertiary-200 bg-tertiary-50/50 text-tertiary-700",
              // Dark mode
              "dark:border-tertiary-800/70 dark:bg-tertiary-900/20 dark:text-tertiary-300"
            )}
          />
        </div>
        
        <div className={cn(
          "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4",
          isMobile && "w-full"
        )}>
          <TableFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            categoryFilter={categoryFilter}
            onCategoryFilterChange={setCategoryFilter}
            uniqueCategories={uniqueCategories}
          />
          
          <div className={cn(
            "text-sm px-2.5 py-1.5 rounded-md whitespace-nowrap",
            // Light mode
            "bg-tertiary-100/70 text-tertiary-700",
            // Dark mode
            "dark:bg-tertiary-900/30 dark:text-tertiary-300",
            // Mobile
            isMobile && "self-end"
          )}>
            {filteredExpenses.length} charge{filteredExpenses.length !== 1 ? 's' : ''} au total
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="relative z-10 p-0 overflow-x-auto">
        <div className={cn(
          "border-t border-b",
          // Light mode
          "border-tertiary-100",
          // Dark mode
          "dark:border-tertiary-800/50"
        )}>
          <Table>
            <TableHeader
              sortField={sortField as keyof RecurringExpense}
              sortDirection={sortDirection}
              onSort={handleSort}
            />
            <ExpenseTableRows
              expenses={paginatedExpenses}
              onViewDetails={handleViewDetails}
              onEditClick={handleEditClick}
              onDeleteClick={handleDeleteClick}
            />
          </Table>
        </div>
      </CardContent>

      {totalPages > 1 && (
        <CardFooter className={cn(
          "justify-center py-4 relative z-10",
    
        )}>
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </CardFooter>
      )}
      
      <TableDialogs
        expenseToDelete={expenseToDelete}
        selectedExpense={selectedExpense}
        showEditDialog={showEditDialog}
        showDetailsDialog={showDetailsDialog}
        setExpenseToDelete={setExpenseToDelete}
        setShowEditDialog={setShowEditDialog}
        setShowDetailsDialog={setShowDetailsDialog}
        onDeleteExpense={onDeleteExpense}
        allExpenses={allExpenses}
      />
    </Card>
  );
};
