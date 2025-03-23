
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LayoutGrid, LayoutList } from "lucide-react";
import { cn } from "@/lib/utils";
import { RetailerCard } from "@/components/expenses/retailer-card/RetailerCard";
import { MiniRetailerCard } from "@/components/expenses/MiniRetailerCard";
import { useMediaQuery } from "@/hooks/useMediaQuery";

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
  const [displayMode, setDisplayMode] = useState<'standard' | 'mini'>('standard');
  const isMobile = useMediaQuery("(max-width: 768px)");
  
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
    <div className="space-y-4 w-full max-w-full">
      <div className="flex justify-end">
        <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-lg inline-flex">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-8 w-8 p-0",
              displayMode === 'standard' && "bg-white dark:bg-gray-700 shadow-sm"
            )}
            onClick={() => setDisplayMode('standard')}
          >
            <LayoutGrid className="h-4 w-4" />
            <span className="sr-only">Affichage standard</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-8 w-8 p-0",
              displayMode === 'mini' && "bg-white dark:bg-gray-700 shadow-sm"
            )}
            onClick={() => setDisplayMode('mini')}
          >
            <LayoutList className="h-4 w-4" />
            <span className="sr-only">Affichage compact</span>
          </Button>
        </div>
      </div>
      
      <motion.div 
        className={cn(
          displayMode === 'standard' 
            ? "grid gap-4" 
            : "grid gap-3",
          // Responsive grid pour mobile et desktop
          isMobile
            ? "grid-cols-1"
            : (displayMode === 'standard' 
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5")
        )}
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
              scale: displayMode === 'standard' ? 1.02 : 1.01,
              rotateX: displayMode === 'standard' ? 2 : 0,
              boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
              z: 20,
              transition: { duration: 0.2 }
            }}
            className="w-full"
            style={{
              transformStyle: "preserve-3d",
              perspective: "1000px"
            }}
          >
            {displayMode === 'standard' ? (
              <RetailerCard 
                retailer={retailer} 
                expenses={retailerExpenses} 
                onExpenseUpdated={onExpenseUpdated} 
                viewMode={viewMode} 
              />
            ) : (
              <MiniRetailerCard
                retailer={retailer}
                expenses={retailerExpenses}
                onExpenseUpdated={onExpenseUpdated}
                viewMode={viewMode}
              />
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
