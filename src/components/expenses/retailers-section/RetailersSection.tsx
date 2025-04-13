
import { Store } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { RetailersGrid, SimpleExpense } from "../RetailersGrid";

interface RetailersSectionProps {
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
  viewMode: "monthly" | "yearly";
  displayMode: "grid" | "list";
}

export function RetailersSection({ 
  expensesByRetailer, 
  onExpenseUpdated, 
  viewMode, 
  displayMode 
}: RetailersSectionProps) {
  // Transformer les données pour qu'elles correspondent à la structure attendue par RetailersGrid
  const formattedExpensesByRetailer = expensesByRetailer.map(item => ({
    retailer: item.retailer,
    expenses: item.expenses.map(expense => ({
      ...expense,
      retailer_id: item.retailer.id // Ajouter la propriété retailer_id manquante
    })) as SimpleExpense[]
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="mt-8"
    >
      <div className="flex items-center mb-4">
        <h2 className={cn(
          "font-bold tracking-tight text-xl flex items-center gap-2",
          // Style cohérent avec les autres sections
          "bg-gradient-to-r from-tertiary-600 via-tertiary-500 to-tertiary-400 bg-clip-text text-transparent",
          "dark:from-tertiary-400 dark:via-tertiary-400 dark:to-tertiary-300"
        )}>
          <div className={cn(
            "p-1 rounded",
            "bg-tertiary-100 dark:bg-tertiary-800/40"
          )}>
            <Store className="h-4 w-4 text-tertiary-600 dark:text-tertiary-400" />
          </div>
          Enseignes
        </h2>
      </div>
      
      <RetailersGrid 
        expensesByRetailer={formattedExpensesByRetailer}
        onExpenseUpdated={onExpenseUpdated}
        viewMode={viewMode}
        displayMode={displayMode}
      />
    </motion.div>
  );
}
