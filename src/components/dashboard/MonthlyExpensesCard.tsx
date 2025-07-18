
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBasket } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { formatCurrency } from "@/utils/format";
import { cn } from "@/lib/utils";

interface MonthlyExpensesCardProps {
  totalExpenses: number;
  viewMode: "monthly" | "yearly";
}

export const MonthlyExpensesCard = ({
  totalExpenses,
  viewMode
}: MonthlyExpensesCardProps) => {
  const navigate = useNavigate();
  const currentMonthName = new Date().toLocaleString('fr-FR', {
    month: 'long'
  });
  
  // Titre et description adaptés en fonction du mode de vue
  const titleText = viewMode === "monthly" ? "Enseignes" : "Enseignes";
  const descriptionText = viewMode === "monthly" 
    ? `Dépenses en ${currentMonthName}` 
    : `Dépenses en ${new Date().getFullYear()}`;

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
          // Light mode styles
           "shadow-lg border hover:shadow-xl",
          // Dark mode styles
          "dark:bg-tertiary/10 dark:border-tertiary/30 dark:shadow-tertiary/30 dark:hover:shadow-tertiary/50"
        )} 
        onClick={() => navigate("/expenses")}
      >
        <CardHeader className="py-4">
          <div className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className={cn(
                "p-2 rounded-full",
                "bg-tertiary/20 text-tertiary",
                "dark:bg-tertiary/20 dark:text-tertiary"
              )}>
                <ShoppingBasket className="h-5 w-5" />
              </div>
              <span className="dark:text-white">{titleText}</span>
            </CardTitle>
          </div>
          <CardDescription className={cn(
            "text-gray-500", 
            "dark:text-gray-400"
          )}>
            {descriptionText}
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="space-y-4">
            <motion.p 
              className={cn(
                "text-xl font-bold leading-none", 
                "text-gray-800",
                "dark:text-tertiary"
              )} 
              initial={{ scale: 0.9 }} 
              animate={{ scale: 1 }} 
              transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            >
              {formatCurrency(totalExpenses)}
            </motion.p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
