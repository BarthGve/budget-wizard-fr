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
  
  const titleText = viewMode === "monthly" ? "Dépenses" : "Dépenses annuelles";
  const descriptionText = viewMode === "monthly" 
    ? `Total du mois de ${currentMonthName}` 
    : `Total de l'année ${new Date().getFullYear()}`;

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
          "bg-primary/10 shadow-lg border border-primary/20 hover:shadow-xl",
          // Dark mode styles
          "dark:bg-primary/10 dark:border-primary/30 dark:shadow-primary/30 dark:hover:shadow-primary/50"
        )} 
        onClick={() => navigate("/expenses")}
      >
        <CardHeader className="py-4">
          <div className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className={cn(
                "p-2 rounded-full",
                "bg-primary/20 text-primary",
                "dark:bg-primary/20 dark:text-primary"
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
                "dark:text-primary"
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