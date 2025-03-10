
import { RecurringExpenseTableProps } from "../types";
import { motion } from "framer-motion";
import { useExpenseTable } from "../hooks/useExpenseTable";
import { EmptyExpenseState } from "./EmptyExpenseState";
import { ExpenseTableContent } from "./ExpenseTableContent";

export const RecurringExpenseTable = ({ expenses, onDeleteExpense }: RecurringExpenseTableProps) => {
  const expenseTable = useExpenseTable(expenses, onDeleteExpense);
  
  // Affichage d'un état vide si aucune dépense n'est disponible
  if (expenses.length === 0) {
    return <EmptyExpenseState />;
  }

  return (
    <motion.div 
      className="space-y-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <ExpenseTableContent 
        expenseTable={expenseTable} 
      />
    </motion.div>
  );
};
