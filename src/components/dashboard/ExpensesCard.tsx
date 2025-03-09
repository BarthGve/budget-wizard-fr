
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  
  const getBadgeVariant = (percentage: number) => {
    if (percentage >= 75) return "default";
    if (percentage >= 50) return "secondary";
    return "destructive";
  };
  
  const getStatusIcon = (percentage: number) => {
    if (percentage >= 75) return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (percentage >= 50) return <Info className="h-4 w-4 text-amber-500" />;
    return <AlertCircle className="h-4 w-4 text-red-500" />;
  };
  
  const getStatusText = (percentage: number) => {
    if (percentage >= 75) return "Presque terminé";
    if (percentage >= 50) return "En cours";
    return "À venir";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -3 }}
    >
      <Card
        className="bg-gradient-to-br from-background to-blue-50 backdrop-blur-sm shadow-lg border border-blue-100 cursor-pointer"
        onClick={() => navigate("/recurring-expenses")}
      >
        <CardHeader className="py-4">
          <div className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl flex items-center gap-2">
              <ClipboardList className="h-6 w-6 text-blue-500" />
              Charges
            </CardTitle>
          {/*  <Badge 
              variant={getBadgeVariant(progressPercentage)} 
              className="px-3 py-1 flex items-center gap-1"
            >
              {getStatusIcon(progressPercentage)}
              <span>{getStatusText(progressPercentage)}</span>
            </Badge> */}
          </div>
          <CardDescription>Du mois de {currentMonthName}</CardDescription>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <motion.p 
                className="text-xl font-bold leading-none text-gray-800"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
              >
                {Math.round(totalExpenses).toLocaleString('fr-FR')} €
              </motion.p>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div 
                    className="flex items-center gap-2 bg-white p-2 rounded-full shadow-sm cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Progress 
                      value={progressPercentage} 
                      className="w-16 h-2"
                    />
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="flex items-center gap-1">
                    <Info className="h-4 w-4" />
                    {Math.round(progressPercentage)}% des charges payées
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
            
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Payé : {Math.round(paidExpenses).toLocaleString('fr-FR')} €</span>
              <span>Reste : {Math.round(totalExpenses - paidExpenses).toLocaleString('fr-FR')} €</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
