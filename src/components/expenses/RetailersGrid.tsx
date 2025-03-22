
import { motion } from "framer-motion";
import { RetailerCard } from "@/components/expenses/RetailerCard";
import { WineRetailerCard } from "@/components/expenses/WineRetailerCard";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Wine, Store } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const [styleMode, setStyleMode] = useState<'standard' | 'wine'>('wine');
  
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
  
  // Fonction pour attribuer une couleur de vin basée sur le nom du retailer ou autre information
  const getWineColorScheme = (retailerId: string, index: number): "burgundy" | "bordeaux" | "champagne" => {
    // Rotation des couleurs basée sur l'index
    const colorSchemes: Array<"burgundy" | "bordeaux" | "champagne"> = ["burgundy", "bordeaux", "champagne"];
    return colorSchemes[index % colorSchemes.length];
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-4">
        <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-1 flex">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setStyleMode('standard')}
            className={cn(
              "rounded-md flex items-center gap-2",
              styleMode === 'standard' 
                ? "bg-white dark:bg-slate-700 shadow-sm" 
                : "hover:bg-white/80 dark:hover:bg-slate-700/80"
            )}
          >
            <Store className="h-4 w-4" />
            <span className="text-sm">Standard</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setStyleMode('wine')}
            className={cn(
              "rounded-md flex items-center gap-2",
              styleMode === 'wine' 
                ? "bg-white dark:bg-slate-700 shadow-sm" 
                : "hover:bg-white/80 dark:hover:bg-slate-700/80"
            )}
          >
            <Wine className="h-4 w-4" />
            <span className="text-sm">Vin</span>
          </Button>
        </div>
      </div>
    
      <motion.div 
        className="grid gap-4 grid-cols-1 md:grid-cols-3 lg:grid-cols-4 mt-4"
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
            {styleMode === 'standard' ? (
              <RetailerCard 
                retailer={retailer} 
                expenses={retailerExpenses} 
                onExpenseUpdated={onExpenseUpdated} 
                viewMode={viewMode} 
              />
            ) : (
              <WineRetailerCard 
                retailer={retailer} 
                expenses={retailerExpenses} 
                onExpenseUpdated={onExpenseUpdated} 
                viewMode={viewMode} 
                colorScheme={getWineColorScheme(retailer.id, index)}
              />
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
