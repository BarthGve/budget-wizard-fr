
import { motion } from "framer-motion";
import { RetailerCard } from "@/components/expenses/RetailerCard";

interface RetailersGridProps {
  expensesByRetailer: Array<{
    retailer: {
      id: string;
      name: string;
      logo_url?: string;
    };
    expenses: Array<{
      id: string;
      date: string;
      amount: number;
      comment?: string;
    }>;
  }>;
  onExpenseUpdated: () => void;
  viewMode: 'monthly' | 'yearly';
}

export const RetailersGrid = ({ expensesByRetailer, onExpenseUpdated, viewMode }: RetailersGridProps) => {
  // Définition des variants pour les animations
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
      rotateX: 15
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

  return (
    <motion.div 
      className="grid gap-4 grid-cols-1 md:grid-cols-3 lg:grid-cols-4 mt-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {expensesByRetailer?.map(({retailer, expenses: retailerExpenses}, index) => 
        <motion.div 
          key={`${retailer.id}-${retailerExpenses.reduce((sum, exp) => sum + exp.amount, 0)}`}
          variants={itemVariants}
          custom={index}
          whileHover={{
            scale: 1.02,
            rotateX: 2,
            boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
            z: 20,
            transition: { duration: 0.2 }
          }}
          style={{
            transformStyle: "preserve-3d",
            perspective: "1000px"
          }}
        >
          <RetailerCard 
            retailer={retailer} 
            expenses={retailerExpenses} 
            onExpenseUpdated={onExpenseUpdated} 
            viewMode={viewMode} 
          />
        </motion.div>
      )}
    </motion.div>
  );
};
