
import { useState, useMemo } from "react";
import { VehicleExpense } from "@/types/vehicle";

// Constante pour le filtre "Tous les types"
export const ALL_EXPENSE_TYPES = "tous";

export const useVehicleExpenseTable = (expenses: VehicleExpense[], onDeleteExpense: (id: string) => void) => {
  // État de recherche et de filtrage
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>(ALL_EXPENSE_TYPES);
  
  // État de tri
  const [sortField, setSortField] = useState<keyof VehicleExpense>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  
  // État de pagination  
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Extraire les types de dépenses uniques
  const uniqueExpenseTypes = useMemo(() => {
    return Array.from(new Set(expenses.map(expense => expense.expense_type)));
  }, [expenses]);

  // Gérer le tri
  const handleSort = (field: keyof VehicleExpense) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Fonction pour filtrer les dépenses
  const filteredExpenses = useMemo(() => {
    return expenses.filter(expense => {
      const matchesSearch = 
        expense.comment?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        expense.expense_type.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === ALL_EXPENSE_TYPES || expense.expense_type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [expenses, searchTerm, typeFilter]);

  // Fonction pour trier les dépenses
  const sortedExpenses = useMemo(() => {
    return [...filteredExpenses].sort((a, b) => {
      const multiplier = sortDirection === "asc" ? 1 : -1;
      
      if (sortField === "amount" || sortField === "fuel_volume" || sortField === "mileage") {
        const aValue = a[sortField] || 0;
        const bValue = b[sortField] || 0;
        return (Number(aValue) - Number(bValue)) * multiplier;
      }
      
      if (sortField === "date") {
        return (new Date(a.date).getTime() - new Date(b.date).getTime()) * multiplier;
      }
      
      return String(a[sortField]).localeCompare(String(b[sortField])) * multiplier;
    });
  }, [filteredExpenses, sortField, sortDirection]);

  // Fonction pour paginer les dépenses
  const paginatedExpenses = useMemo(() => {
    if (itemsPerPage === -1) {
      return sortedExpenses;
    }
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedExpenses.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedExpenses, currentPage, itemsPerPage]);

  // Calculer le nombre total de pages
  const totalPages = useMemo(() => {
    if (itemsPerPage === -1) return 1;
    return Math.max(1, Math.ceil(sortedExpenses.length / itemsPerPage));
  }, [sortedExpenses.length, itemsPerPage]);

  // Gérer le changement d'items par page
  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1); // Réinitialiser à la première page lors du changement
  };

  return {
    // États
    searchTerm,
    typeFilter,
    sortField,
    sortDirection,
    itemsPerPage,
    currentPage,
    
    // Données
    uniqueExpenseTypes,
    filteredExpenses,
    paginatedExpenses,
    totalPages,
    allExpenseTypes: ALL_EXPENSE_TYPES,
    
    // Setters
    setSearchTerm,
    setTypeFilter,
    setCurrentPage,
    
    // Handlers
    handleSort,
    handleItemsPerPageChange,
    
    // Actions
    onDeleteExpense
  };
};
