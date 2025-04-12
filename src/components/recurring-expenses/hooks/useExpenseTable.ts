
import { useState, useMemo, useCallback } from "react";
import { RecurringExpense } from "../types";
import { toast } from "sonner";

export const useExpenseTable = (expenses: RecurringExpense[], onDeleteExpense: (id: string) => Promise<void>) => {
  // États pour la recherche et les filtres
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all_categories");
  
  // État pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // États pour le tri
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  
  // États pour les dialogues
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<RecurringExpense | null>(null);
  const [expenseToDelete, setExpenseToDelete] = useState<RecurringExpense | null>(null);
  
  // Mémoiser les catégories uniques
  const uniqueCategories = useMemo(() => {
    const categories: string[] = [];
    expenses.forEach(expense => {
      if (!categories.includes(expense.category)) {
        categories.push(expense.category);
      }
    });
    return categories.sort();
  }, [expenses]);
  
  // Filtrer les dépenses en fonction de la recherche et des filtres
  const filteredExpenses = useMemo(() => {
    return expenses.filter(expense => {
      // Filtre de recherche
      const matchesSearch = expense.name?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filtre de catégorie
      const matchesCategory = categoryFilter === "all_categories" || 
                             expense.category === categoryFilter;
      
      return matchesSearch && matchesCategory;
    });
  }, [expenses, searchTerm, categoryFilter]);
  
  // Trier les dépenses filtrées
  const sortedExpenses = useMemo(() => {
    return [...filteredExpenses].sort((a, b) => {
      const fieldA = (a as any)[sortField];
      const fieldB = (b as any)[sortField];
      
      if (fieldA < fieldB) return sortDirection === "asc" ? -1 : 1;
      if (fieldA > fieldB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredExpenses, sortField, sortDirection]);
  
  // Calculer les dépenses pour la page actuelle
  const paginatedExpenses = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedExpenses.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedExpenses, currentPage, itemsPerPage]);
  
  // Calculer le nombre total de pages
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredExpenses.length / itemsPerPage));
  }, [filteredExpenses.length, itemsPerPage]);
  
  // Gérer le changement de tri
  const handleSort = useCallback((field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  }, [sortField, sortDirection]);
  
  // Gérer le changement d'éléments par page
  const handleItemsPerPageChange = useCallback((value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1); // Réinitialiser à la première page
  }, []);
  
  // Gérer les actions sur les dépenses
  const handleViewDetails = useCallback((expense: RecurringExpense) => {
    setSelectedExpense(expense);
    setShowDetailsDialog(true);
  }, []);
  
  const handleEditClick = useCallback((expense: RecurringExpense) => {
    setSelectedExpense(expense);
    setShowEditDialog(true);
  }, []);
  
  const handleDeleteClick = useCallback((expense: RecurringExpense) => {
    setExpenseToDelete(expense);
  }, []);
  
  // Fonction pour supprimer une dépense
  const handleDeleteExpense = useCallback(async () => {
    if (!expenseToDelete) return;
    
    try {
      await onDeleteExpense(expenseToDelete.id);
      toast.success("Dépense supprimée avec succès");
      setExpenseToDelete(null);
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.error("Erreur lors de la suppression de la dépense");
    }
  }, [expenseToDelete, onDeleteExpense]);
  
  return {
    // États
    searchTerm,
    categoryFilter,
    currentPage,
    itemsPerPage,
    sortField,
    sortDirection,
    showEditDialog,
    showDetailsDialog,
    selectedExpense,
    expenseToDelete,
    
    // Données calculées
    uniqueCategories,
    filteredExpenses,
    sortedExpenses,
    paginatedExpenses,
    totalPages,
    allExpenses: expenses, // Ajouter toutes les dépenses pour l'accès depuis d'autres composants
    
    // Setters
    setSearchTerm,
    setCategoryFilter,
    setCurrentPage,
    setItemsPerPage,
    setSortField,
    setSortDirection,
    setShowEditDialog,
    setShowDetailsDialog,
    setSelectedExpense,
    setExpenseToDelete,
    
    // Handlers
    handleSort,
    handleItemsPerPageChange,
    handleViewDetails,
    handleEditClick,
    handleDeleteClick,
    handleDeleteExpense,
    onDeleteExpense
  };
};
