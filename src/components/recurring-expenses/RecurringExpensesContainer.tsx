
import { motion } from "framer-motion";
import { RecurringExpensesHeader } from "./RecurringExpensesHeader";
import { RecurringExpensesSummaryCards } from "./RecurringExpensesSummaryCards";
import { RecurringExpenseTable } from "./RecurringExpenseTable";
import { CreateCategoryBanner } from "@/components/common/CreateCategoryBanner";
import { RecurringExpense } from "./types";
import { useFirstVisit } from "@/hooks/useFirstVisit";

interface RecurringExpensesContainerProps {
  recurringExpenses: RecurringExpense[];
  onDeleteExpense: (id: string) => Promise<void>;
}

export const RecurringExpensesContainer = ({
  recurringExpenses,
  onDeleteExpense
}: RecurringExpensesContainerProps) => {
  // Vérifier si c'est la première visite de la page RecurringExpenses
  const isFirstVisit = useFirstVisit('recurring-expenses-page');
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: isFirstVisit ? 0.1 : 0,
        delayChildren: isFirstVisit ? 0.2 : 0
      }
    }
  };
  
  const itemVariants = isFirstVisit ? {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95,
      rotateX: 10
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  } : { hidden: {}, visible: {} };

  const monthlyTotal = recurringExpenses?.filter(expense => expense.periodicity === "monthly").reduce((sum, expense) => sum + expense.amount, 0) || 0;
  const quarterlyTotal = recurringExpenses?.filter(expense => expense.periodicity === "quarterly").reduce((sum, expense) => sum + expense.amount, 0) || 0;
  const yearlyTotal = recurringExpenses?.filter(expense => expense.periodicity === "yearly").reduce((sum, expense) => sum + expense.amount, 0) || 0;

  return (
    <motion.div 
      className="space-y-6 max-w-[1600px] mx-auto px-4"
      initial={isFirstVisit ? "hidden" : false}
      animate={isFirstVisit ? "visible" : false}
      variants={containerVariants}
    >
      <RecurringExpensesHeader isFirstVisit={isFirstVisit} />

      <motion.div variants={itemVariants}>
        <CreateCategoryBanner />
      </motion.div>

      <RecurringExpensesSummaryCards
        monthlyTotal={monthlyTotal}
        quarterlyTotal={quarterlyTotal}
        yearlyTotal={yearlyTotal}
        isFirstVisit={isFirstVisit}
      />

      <motion.div 
        className="w-full overflow-hidden"
        variants={itemVariants}
      >
        <RecurringExpenseTable expenses={recurringExpenses} onDeleteExpense={onDeleteExpense} isFirstVisit={isFirstVisit} />
      </motion.div>
    </motion.div>
  );
};
