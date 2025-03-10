import { Table } from "@/components/ui/table";
import { RecurringExpenseTableProps } from "./types";
import { TableFilters } from "./TableFilters";
import { motion } from "framer-motion";
import { TablePagination } from "./table/TablePagination";
import { useExpenseTable } from "./hooks/useExpenseTable";
import { ExpenseTableHeader } from "./table/TableHeader";
import { ExpenseTableRows } from "./table/ExpenseTableRows";
import { TableDialogs } from "./table/TableDialogs";
import { ItemsPerPageSelect } from "./table/ItemsPerPageSelect";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TableIcon, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

export const RecurringExpenseTable = ({ expenses, onDeleteExpense }: RecurringExpenseTableProps) => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

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
    itemsPerPage
  } = useExpenseTable(expenses, onDeleteExpense);

  if (expenses.length === 0) {
    return (
      <Card className={cn(
        "border shadow-sm overflow-hidden",
        // Light mode
        "bg-white border-blue-100", 
        // Dark mode
        "dark:bg-gray-800/90 dark:border-blue-800/50"
      )}>
        <CardContent className="py-12">
          <div className={cn(
            "flex flex-col items-center justify-center gap-4 text-center",
            // Light mode
            "text-blue-500/80",
            // Dark mode
            "dark:text-blue-400/80"
          )}>
            <FileText className="h-12 w-12 opacity-40" />
            <div className="space-y-2">
              <h3 className={cn(
                "font-semibold text-lg",
                // Light mode
                "text-blue-700",
                // Dark mode
                "dark:text-blue-300"
              )}>
                Aucune charge récurrente
              </h3>
              <p className="max-w-md text-sm">
                Vous n'avez pas encore ajouté de charges récurrentes. Commencez par ajouter une nouvelle dépense.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div 
      className="space-y-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className={cn(
        "border shadow-sm overflow-hidden relative",
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
          <div className="flex justify-between items-start mb-4">
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
                Liste des charges récurrentes
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
          
          <TableFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            categoryFilter={categoryFilter}
            onCategoryFilterChange={setCategoryFilter}
            uniqueCategories={uniqueCategories}
          />
          
          <div className="flex justify-start items-center mt-4">
            <div className={cn(
              "text-sm px-2 py-1 rounded-md",
              // Light mode
              "bg-blue-100/70 text-blue-700",
              // Dark mode
              "dark:bg-blue-900/30 dark:text-blue-300"
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
              <ExpenseTableHeader
                sortField={sortField}
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
        />
      </Card>
    </motion.div>
  );
};
