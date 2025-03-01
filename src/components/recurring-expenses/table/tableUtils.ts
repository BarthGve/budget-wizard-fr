
import { RecurringExpense } from "../types";

export interface SortConfig {
  key: keyof RecurringExpense;
  direction: "asc" | "desc";
}

export const filterExpenses = (
  expenses: RecurringExpense[], 
  searchTerm: string,
  categoryFilter: string,
  periodicityFilter: string,
  allCategories: string,
  allPeriodicities: string
): RecurringExpense[] => {
  return expenses.filter(expense => {
    const matchesSearch = expense.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === allCategories || expense.category === categoryFilter;
    const matchesPeriodicity = periodicityFilter === allPeriodicities || expense.periodicity === periodicityFilter;
    return matchesSearch && matchesCategory && matchesPeriodicity;
  });
};

export const sortExpenses = (
  expenses: RecurringExpense[],
  sortField: keyof RecurringExpense,
  sortDirection: "asc" | "desc"
): RecurringExpense[] => {
  return [...expenses].sort((a, b) => {
    const multiplier = sortDirection === "asc" ? 1 : -1;
    if (sortField === "amount") {
      return (a[sortField] - b[sortField]) * multiplier;
    }
    return String(a[sortField]).localeCompare(String(b[sortField])) * multiplier;
  });
};

export const paginateExpenses = (
  expenses: RecurringExpense[],
  currentPage: number,
  rowsPerPage: number
): RecurringExpense[] => {
  if (rowsPerPage === -1) {
    return expenses;
  }
  return expenses.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
};

// Add the missing function to filter and sort expenses
export const filterAndSortExpenses = (
  expenses: RecurringExpense[],
  searchTerm: string,
  categoryFilter: string | null,
  sortConfig: SortConfig
): RecurringExpense[] => {
  // First filter by search term and category
  const filtered = expenses.filter(expense => {
    const matchesSearch = expense.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || expense.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Then sort the filtered expenses
  return [...filtered].sort((a, b) => {
    const multiplier = sortConfig.direction === "asc" ? 1 : -1;
    if (sortConfig.key === "amount") {
      return (a[sortConfig.key] - b[sortConfig.key]) * multiplier;
    }
    return String(a[sortConfig.key]).localeCompare(String(b[sortConfig.key])) * multiplier;
  });
};
