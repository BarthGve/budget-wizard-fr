
import { RecurringExpense } from "../types";

export const filterExpenses = (
  expenses: RecurringExpense[], 
  searchTerm: string,
  categoryFilter: string,
  periodicityFilter: string | null, // Mis à jour pour accepter null
  allCategories: string,
  allPeriodicities: string
): RecurringExpense[] => {
  return expenses.filter(expense => {
    const matchesSearch = expense.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === allCategories || expense.category === categoryFilter;
    // Ne filtre par périodicité que si periodicityFilter n'est pas null
    const matchesPeriodicity = periodicityFilter === null || 
                            periodicityFilter === allPeriodicities || 
                            expense.periodicity === periodicityFilter;
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
