import { Button } from "@/components/ui/button";
import { BarChart } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCategoryColor } from "@/utils/colors";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface RecurringExpense {
  id: string;
  name: string;
  amount: number;
}

interface RecurringExpensesCardProps {
  recurringExpenses: RecurringExpense[];
  totalExpenses: number;
}

export const RecurringExpensesCard = ({ recurringExpenses, totalExpenses }: RecurringExpensesCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={cn(
        "col-span-full",
        "backdrop-blur-lg shadow-md border-gray-200/50",
        "dark:bg-gradient-to-br dark:from-gray-900/90 dark:to-gray-950/90 dark:border-gray-800/20 dark:shadow-gray-900/20"
      )}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <div>
            <CardTitle className="text-base font-medium">Répartition des Dépenses Récurrentes</CardTitle>
            <p className={cn(
              "text-xs mt-0.5",
              "text-gray-500",
              "dark:text-gray-400"
            )}>Vue d'ensemble par catégorie</p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            asChild
            className={cn(
              "hover:bg-primary/10 hover:text-primary text-xs border-primary/20",
              "dark:bg-gray-800/50 dark:border-gray-700/50 dark:hover:bg-primary/20"
            )}
          >
            <Link to="/recurring-expenses">
              <BarChart className="mr-1.5 h-3.5 w-3.5" />
              Gérer les charges
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recurringExpenses?.map((expense, index) => (
              <motion.div 
                key={expense.id}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="flex items-center gap-3"
              >
                <span className={cn(
                  "font-medium text-sm w-1/4",
                  "dark:text-gray-200"
                )}>{expense.name}</span>
                
                <div className="h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 flex-grow">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(expense.amount / totalExpenses) * 100}%`,
                      backgroundColor: getCategoryColor(index),
                    }}
                  />
                </div>
                
                <span className={cn(
                  "text-primary font-semibold text-sm w-20 text-right",
                  "dark:text-primary-300"
                )}>{Math.round(expense.amount)} €</span>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};