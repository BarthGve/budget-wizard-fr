
import { motion } from "framer-motion";
import { CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CreditCardAmountProps {
  totalAmount: number;
}

/**
 * Composant qui affiche le montant total des mensualités
 */
export const CreditCardAmount = ({ totalAmount }: CreditCardAmountProps) => {
  return (
    <CardContent className="pb-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <motion.div
            className="relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.p 
              className={cn(
                "text-xl font-bold leading-none",
                "text-gray-800", // Light mode
                "dark:text-purple-100" // Dark mode - légèrement teinté de violet pour l'effet visuel
              )}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            >
              {Math.round(totalAmount).toLocaleString('fr-FR')} €
            </motion.p>
            
            {/* Effet de lueur subtil - visible uniquement en dark mode */}
            <div className="absolute -inset-1 bg-purple-500/10 blur-md rounded-full opacity-0 dark:opacity-60" />
          </motion.div>
        </div>
      </div>
    </CardContent>
  );
};
