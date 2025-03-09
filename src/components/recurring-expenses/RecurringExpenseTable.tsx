
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
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";

export const RecurringExpenseTable = ({ expenses, onDeleteExpense }: RecurringExpenseTableProps) => {
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
      <p className="text-center py-8 text-muted-foreground">
        Aucune charge récurrente enregistrée
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
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
          uniqueCategories={uniqueCategories}
        />
      </motion.div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          {filteredExpenses.length} charge{filteredExpenses.length !== 1 ? 's' : ''} au total
        </div>
        <ItemsPerPageSelect 
          itemsPerPage={itemsPerPage}
          onChange={handleItemsPerPageChange}
        />
      </div>
      </CardHeader>
      
      <div className="overflow-x-auto">
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
<CardFooter>
      {totalPages > 1 && (
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
</CardFooter>
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
    </div>
  );
};
