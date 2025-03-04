
import { motion } from "framer-motion";
import { useState } from "react";
import { RecurringExpensesHeader } from "./RecurringExpensesHeader";
import { RecurringExpensesSummaryCards } from "./RecurringExpensesSummaryCards";
import { RecurringExpenseTable } from "./RecurringExpenseTable";
import { CreateCategoryBanner } from "@/components/common/CreateCategoryBanner";
import { RecurringExpense } from "./types";

interface RecurringExpensesContainerProps {
  recurringExpenses: RecurringExpense[];
  onDeleteExpense: (id: string) => Promise<void>;
}

export const RecurringExpensesContainer = ({
  recurringExpenses,
  onDeleteExpense
}: RecurringExpensesContainerProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState<"monthly" | "quarterly" | "yearly" | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
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
  };

  const monthlyTotal = recurringExpenses?.filter(expense => expense.periodicity === "monthly").reduce((sum, expense) => sum + expense.amount, 0) || 0;
  const quarterlyTotal = recurringExpenses?.filter(expense => expense.periodicity === "quarterly").reduce((sum, expense) => sum + expense.amount, 0) || 0;
  const yearlyTotal = recurringExpenses?.filter(expense => expense.periodicity === "yearly").reduce((sum, expense) => sum + expense.amount, 0) || 0;

  // Filtrer les dépenses en fonction de la période sélectionnée
  const filteredExpenses = selectedPeriod 
    ? recurringExpenses.filter(expense => expense.periodicity === selectedPeriod)
    : recurringExpenses;

  return (
    <motion.div 
      className="space-y-6  mx-auto px-4 mt-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <RecurringExpensesHeader />

      <motion.div variants={itemVariants}>
        <CreateCategoryBanner />
      </motion.div>

      <RecurringExpensesSummaryCards
        monthlyTotal={monthlyTotal}
        quarterlyTotal={quarterlyTotal}
        yearlyTotal={yearlyTotal}
        onPeriodSelect={setSelectedPeriod}
        selectedPeriod={selectedPeriod}
      />

      <motion.div 
        className="w-full overflow-hidden"
        variants={itemVariants}
      >
        <RecurringExpenseTable 
          expenses={filteredExpenses} 
          onDeleteExpense={onDeleteExpense} 
        />
      </motion.div>
    </motion.div>
  );
};
