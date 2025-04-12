
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
      "bg-white border-blue-100",
      // Dark mode
      "dark:bg-gray-800/90 dark:border-blue-800/50"
    )}>
      <div className={cn(
        "absolute inset-0 opacity-5",
        // Light mode
        "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-400 via-blue-300 to-transparent",
        // Dark mode
        "dark:opacity-10 dark:from-blue-400 dark:via-blue-500 dark:to-transparent"
      )} />

      <CardHeader className="relative z-10">
        <div className={cn(
          "flex justify-between items-start mb-4",
          isMobile && "flex-col gap-3"
        )}>
          <div>
            <CardTitle className={cn(
              "text-xl font-semibold flex items-center gap-2",
              // Light mode
              "text-blue-700",
              // Dark mode
              "dark:text-blue-300"
            )}>
              <div className={cn(
                "p-1.5 rounded",
                // Light mode
                "bg-blue-100",
                // Dark mode
                "dark:bg-blue-800/40"
              )}>
                <TableIcon className={cn(
                  "h-5 w-5",
                  // Light mode
                  "text-blue-600",
                  // Dark mode
                  "dark:text-blue-400"
                )} />
              </div>
              Listing
            </CardTitle>
            <CardDescription className={cn(
              "mt-1 text-sm",
              // Light mode
              "text-blue-600/80",
              // Dark mode
              "dark:text-blue-400/90"
            )}>
              Consultez et gérez l'ensemble de vos dépenses récurrentes
            </CardDescription>
          </div>
          
          <ItemsPerPageSelect 
            itemsPerPage={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className={cn(
              // Light mode
              "border-blue-200 bg-blue-50/50 text-blue-700",
              // Dark mode
              "dark:border-blue-800/70 dark:bg-blue-900/20 dark:text-blue-300"
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
            "bg-blue-100/70 text-blue-700",
            // Dark mode
            "dark:bg-blue-900/30 dark:text-blue-300",
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
          "border-blue-100",
          // Dark mode
          "dark:border-blue-800/50"
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
          // Light mode
          "bg-blue-50/30",
          // Dark mode
          "dark:bg-blue-900/10"
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
