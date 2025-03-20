
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Receipt } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { formatCurrency } from "@/utils/format";
import { cn } from "@/lib/utils";

interface MonthlyExpensesCardProps {
  totalExpenses: number;
}

export const MonthlyExpensesCard = ({
  totalExpenses,
}: MonthlyExpensesCardProps) => {
  const navigate = useNavigate();
  const currentMonthName = new Date().toLocaleString('fr-FR', { month: 'long' });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -3 }}
    >
      <Card
        className={cn(
          "backdrop-blur-sm cursor-pointer transition-all duration-300 h-full",
          // Light mode styles - Bleu au lieu de jaune/ambre
          "bg-gradient-to-br from-background to-blue-50 shadow-lg border border-blue-100 hover:shadow-xl",
          // Dark mode styles - Bleu au lieu de jaune/ambre
          "dark:bg-gradient-to-br dark:from-gray-900 dark:to-blue-950 dark:border-blue-900/30 dark:shadow-blue-800/30 dark:hover:shadow-blue-800/50"
        )}
        onClick={() => navigate("/expenses")}
      >
        <CardHeader className="py-4">
          <div className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className={cn(
                "p-2 rounded-full",
                // Icône dans un cercle bleu
                "bg-blue-100 text-blue-600", // Light mode
                "dark:bg-blue-900/40 dark:text-blue-400" // Dark mode
              )}>
                <Receipt className="h-5 w-5" />
              </div>
              <span className="dark:text-white">Dépenses</span>
            </CardTitle>
          </div>
          <CardDescription className={cn(
            "text-gray-500",
            "dark:text-gray-400"
          )}>
            Total du mois de {currentMonthName}
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="space-y-4">
            <motion.p 
              className={cn(
                "text-xl font-bold leading-none",
                "text-gray-800", // Light mode
                "dark:text-blue-100" // Dark mode - texte bleu clair au lieu d'ambre
              )}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            >
              {formatCurrency(totalExpenses)}
            </motion.p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Cliquez pour voir le détail
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
