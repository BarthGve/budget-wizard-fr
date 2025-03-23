
import { motion, AnimatePresence } from "framer-motion";
import { formatCurrency } from "@/utils/format";
import { cn } from "@/lib/utils";

interface AmountDisplayProps {
  periodLabel: string;
  amount: number;
  prevAmount: number;
  hasIncreased: boolean;
  hasChanged: boolean;
}

export function AmountDisplay({ 
  periodLabel, 
  amount, 
  prevAmount, 
  hasIncreased, 
  hasChanged 
}: AmountDisplayProps) {
  return (
    <div>
      <div className="text-xs text-gray-500 dark:text-gray-400">
        {periodLabel}
      </div>
      <div className="flex items-center gap-2 mt-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={amount}
            initial={hasChanged ? { opacity: 0, y: hasIncreased ? 20 : -20 } : false}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: hasIncreased ? -20 : 20 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "text-2xl font-bold",
              // Teinte bleue pour le montant
              "text-blue-700 dark:text-blue-200"
            )}
          >
            {formatCurrency(amount)}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
