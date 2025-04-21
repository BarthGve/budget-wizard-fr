import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ExpensesList } from "@/components/properties/ExpensesList";
import { ExpensesChart } from "@/components/properties/expenses/ExpensesChart";
import { motion } from "framer-motion";

interface PropertyExpensesSectionProps {
  expenses: any[] | null;
  isLoadingExpenses: boolean;
  refetchExpenses: () => void;
  onExpenseEdit: (expense: any) => void;
}

export const PropertyExpensesSection = ({ 
  expenses, 
  isLoadingExpenses, 
  refetchExpenses, 
  onExpenseEdit 
}: PropertyExpensesSectionProps) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.07
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <motion.div 
      className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 w-full mt-2"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        variants={itemVariants}
        whileHover={{ 
          scale: 1.01,
          boxShadow: "0 5px 15px rgba(90,81,207,0.09)",
        }}
        className="w-full"
      >
        <Card className="p-6 bg-white/80 dark:bg-quaternary-900/40 shadow-lg rounded-2xl border border-white/20 dark:border-quaternary-900/20">
          <h2 className="text-lg md:text-xl font-semibold mb-4 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Dépenses
          </h2>
          {isLoadingExpenses ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <ExpensesList 
              expenses={expenses || []} 
              onExpenseDeleted={() => refetchExpenses()} 
              onExpenseEdit={onExpenseEdit} 
            />
          )}
        </Card>
      </motion.div>

      {!isLoadingExpenses && expenses && (
        <motion.div 
          variants={itemVariants}
          whileHover={{ 
            scale: 1.01,
            boxShadow: "0 5px 15px rgba(90,81,207,0.09)"
          }}
          className="w-full"
        >
          <Card className="p-6 bg-white/80 dark:bg-quaternary-900/40 shadow-lg rounded-2xl border border-white/20 dark:border-quaternary-900/20">
            <ExpensesChart expenses={expenses} />
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
};
