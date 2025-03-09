
import { useState } from "react";
import { RecurringExpense, ALL_CATEGORIES } from "../types";
import { filterExpenses, sortExpenses, paginateExpenses } from "../table/tableUtils";

export const useExpenseTable = (expenses: RecurringExpense[], onDeleteExpense: (id: string) => Promise<void>) => {
  // État de recherche et de filtrage
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>(ALL_CATEGORIES);
  
  // État de tri
  const [sortField, setSortField] = useState<keyof RecurringExpense>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  
  // État de pagination  
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState(1);
  
  // État des dialogues
  const [expenseToDelete, setExpenseToDelete] = useState<RecurringExpense | null>(null);
  const [selectedExpense, setSelectedExpense] = useState<RecurringExpense | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  // Extraire les catégories uniques
  const uniqueCategories = Array.from(new Set(expenses.map(expense => expense.category)));

  // Gérer le tri
  const handleSort = (field: keyof RecurringExpense) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Gérer les actions sur les charges
  const handleDeleteClick = (expense: RecurringExpense) => {
    setExpenseToDelete(expense);
  };

  const handleEditClick = (expense: RecurringExpense) => {
    setSelectedExpense(expense);
    setShowEditDialog(true);
  };

  const handleViewDetails = (expense: RecurringExpense) => {
    setSelectedExpense(expense);
    setShowDetailsDialog(true);
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  // Filtrer et trier les charges
  const filteredExpenses = filterExpenses(expenses, searchTerm, categoryFilter, null, ALL_CATEGORIES, "");
  const sortedExpenses = sortExpenses(filteredExpenses, sortField, sortDirection);
  const totalPages = itemsPerPage === -1 ? 1 : Math.ceil(sortedExpenses.length / itemsPerPage);
  const paginatedExpenses = paginateExpenses(sortedExpenses, currentPage, itemsPerPage);

  return {
    // États
    searchTerm,
    categoryFilter,
    sortField,
    sortDirection,
    itemsPerPage,
    currentPage,
    expenseToDelete,
    selectedExpense,
    showEditDialog,
    showDetailsDialog,
    uniqueCategories,
    
    // Données calculées
    filteredExpenses,
    paginatedExpenses,
    totalPages,
    
    // Setters
    setSearchTerm,
    setCategoryFilter,
    setCurrentPage,
    setExpenseToDelete,
    setShowEditDialog,
    setShowDetailsDialog,
    
    // Handlers
    handleSort,
    handleDeleteClick,
    handleEditClick,
    handleViewDetails,
    handleItemsPerPageChange,
    
    // Actions
    onDeleteExpense
  };
};
