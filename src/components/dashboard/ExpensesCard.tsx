import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ClipboardList, Info } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface ExpensesCardProps {
  totalExpenses: number;
  recurringExpenses: Array<{
    amount: number;
    debit_day: number;
    debit_month: number | null;
    periodicity: "monthly" | "quarterly" | "yearly";
  }>;
}

export const ExpensesCard = ({
  totalExpenses,
  recurringExpenses,
}: ExpensesCardProps) => {
  const navigate = useNavigate();
  const currentDay = new Date().getDate();
  const currentMonth = new Date().getMonth() + 1; // Les mois commencent à 0

  const paidExpenses = recurringExpenses.reduce((sum, expense) => {
    const shouldIncludeExpense = () => {
      switch (expense.periodicity) {
        case "monthly":
          return currentDay >= expense.debit_day;
        case "quarterly":
          return expense.debit_month === currentMonth && currentDay >= expense.debit_day;
        case "yearly":
          return expense.debit_month === currentMonth && currentDay >= expense.debit_day;
        default:
          return false;
      }
    };

    return shouldIncludeExpense() ? sum + expense.amount : sum;
  }, 0);

  const progressPercentage = (paidExpenses / totalExpenses) * 100;
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
          "backdrop-blur-sm cursor-pointer transition-all duration-300 hover:shadow-xl",
          // Light mode styles
          "bg-gradient-to-br from-background to-blue-50 shadow-lg border border-blue-100",
          // Dark mode styles
          "dark:bg-gradient-to-br dark:from-gray-900 dark:to-blue-950 dark:border-blue-900/50 dark:shadow-blue-900/10"
        )}
        onClick={() => navigate("/recurring-expenses")}
      >
        <CardHeader className="py-4">
          <div className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl flex items-center gap-2">
              <div className={cn(
                "p-2 rounded-full",
                "bg-blue-100 text-blue-600", // Light mode
                "dark:bg-blue-900/40 dark:text-blue-400" // Dark mode
              )}>
                <ClipboardList className="h-5 w-5" />
              </div>
              <span className="dark:text-white">Charges</span>
            </CardTitle>
          </div>
          <CardDescription className={cn(
            "text-gray-500",
            "dark:text-gray-400"
          )}>
            Du mois de {currentMonthName}
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <motion.p 
                className={cn(
                  "text-xl font-bold leading-none w-1/3",
                  "text-gray-800", // Light mode
                  "dark:text-blue-100" // Dark mode
                )}
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
              >
                {Math.round(totalExpenses).toLocaleString('fr-FR')} €
              </motion.p>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="w-2/3">
                    <Progress 
                      value={progressPercentage}
                      className={cn(
                        "h-2.5 rounded-full",
                        // Light mode - progress background
                        "bg-gray-200",
                        // Dark mode - progress background
                        "dark:bg-gray-800"
                      )}
                      // La couleur de l'indicateur de progression
                      style={{
                        '--progress-foreground': 'var(--blue-500)',
                        '--progress-background': 'var(--gray-200)'
                      } as React.CSSProperties}
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent className="dark:bg-gray-800 dark:border-gray-700">
                  <p className="flex items-center gap-1 dark:text-white">
                    <Info className="h-4 w-4" />
                    {Math.round(progressPercentage)}% des charges payées
                  </p>
                  <span className="dark:text-gray-300">
                    Reste : <span className="font-medium dark:text-blue-300">{Math.round(totalExpenses - paidExpenses).toLocaleString('fr-FR')} €</span>
                  </span>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
