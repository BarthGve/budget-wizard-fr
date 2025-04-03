
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
        staggerChildren: 0.1,
        delayChildren: 0.1
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
      className="grid lg:grid-cols-2 gap-4 md:col-span-2"
      variants={containerVariants}
    >
      <motion.div 
        variants={itemVariants}
        whileHover={{ 
          scale: 1.01,
          boxShadow: "0 5px 15px rgba(0, 0, 0, 0.05)"
        }}
      >
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Dépenses</h2>
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
            boxShadow: "0 5px 15px rgba(0, 0, 0, 0.05)"
          }}
        >
          <Card className="p-6">
            <ExpensesChart expenses={expenses} />
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
};
