
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CalendarDays, CalendarRange } from "lucide-react";
import { motion } from "framer-motion";
import { formatCurrency } from "@/utils/format";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { RecurringExpense } from "./types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { formatDebitDate } from "./utils";

interface RecurringExpensesSummaryCardsProps {
  monthlyTotal: number;
  quarterlyTotal: number;
  yearlyTotal: number;
  onPeriodSelect: (period: "monthly" | "quarterly" | "yearly" | null) => void;
  selectedPeriod: "monthly" | "quarterly" | "yearly" | null;
  recurringExpenses: RecurringExpense[]; // Ajout de la liste complète des charges récurrentes
}

export const RecurringExpensesSummaryCards = ({
  monthlyTotal,
  quarterlyTotal,
  yearlyTotal,
  onPeriodSelect,
  selectedPeriod,
  recurringExpenses
}: RecurringExpensesSummaryCardsProps) => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  
  // Filtrer les charges annuelles
  const yearlyExpenses = recurringExpenses.filter(expense => expense.periodicity === "yearly");
  
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
  
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: (i: number) => ({ 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: i * 0.1
      }
    })
  };

  // Fonction pour rendre le contenu du tooltip des charges annuelles
  const renderYearlyExpensesTooltip = () => {
    if (yearlyExpenses.length === 0) {
      return <p className="text-sm italic">Aucune charge annuelle</p>;
    }

    return (
      <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
        <h4 className="font-medium text-blue-500 dark:text-blue-300 border-b pb-1 mb-2">
          Liste des charges annuelles
        </h4>
        {yearlyExpenses.map((expense) => (
          <div key={expense.id} className="flex flex-col border-l-2 border-blue-400 dark:border-blue-500 pl-3 py-1">
            <div className="flex justify-between items-start mb-1">
              <span className="font-medium">{expense.name}</span>
              <span className="font-semibold text-blue-600 dark:text-blue-400">{formatCurrency(expense.amount)}</span>
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {formatDebitDate(expense.debit_day, expense.debit_month, expense.periodicity)}
            </span>
            {expense.category && (
              <span className="text-xs mt-1 inline-flex items-center px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 max-w-fit">
                {expense.category}
              </span>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <motion.div 
      className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {[
        {
          title: "Mensuel",
          value: monthlyTotal,
          description: "Charges mensuelles",
          Icon: Calendar,
          index: 0,
          period: "monthly" as const
        },
        {
          title: "Trimestriel",
          value: quarterlyTotal,
          description: "Charges trimestrielles",
          Icon: CalendarDays,
          index: 1,
          period: "quarterly" as const
        },
        {
          title: "Annuel",
          value: yearlyTotal,
          description: "Charges annuelles",
          Icon: CalendarRange,
          index: 2,
          period: "yearly" as const,
          showTooltip: true // Indicateur pour afficher le tooltip seulement pour cette carte
        }
      ].map(({ title, value, description, Icon, index, period, showTooltip }) => (
        <motion.div
          key={title}
          custom={index}
          variants={cardVariants}
          whileHover={{ 
            y: -5, 
            transition: { duration: 0.2 }
          }}
        >
          {showTooltip ? (
            <HoverCard openDelay={200} closeDelay={100}>
              <HoverCardTrigger asChild>
                <div onClick={() => onPeriodSelect(selectedPeriod === period ? null : period)}>
                  <Card 
                    className={cn(
                      "overflow-hidden transition-all duration-200 cursor-pointer h-full relative",
                      // Base styling
                      "border shadow-sm hover:shadow-md",
                      // Selected state
                      selectedPeriod === period && "ring-2 ring-blue-500 dark:ring-blue-400",
                      // Light mode
                      "bg-white hover:bg-blue-50",
                      // Dark mode
                      "dark:bg-gray-800/90 dark:hover:bg-blue-900/20 dark:border-blue-800/50"
                    )}
                    style={{
                      boxShadow: selectedPeriod === period 
                        ? (isDarkMode 
                          ? "0 4px 14px -2px rgba(30, 64, 175, 0.35)" 
                          : "0 4px 14px -2px rgba(37, 99, 235, 0.25)")
                        : undefined
                    }}
                  >
                    {/* Ajout du fond radial gradient comme dans RecurringExpensesCategoryChart */}
                    <div className={cn(
                      "absolute inset-0 opacity-5",
                      // Light mode
                      "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-400 via-blue-300 to-transparent",
                      // Dark mode
                      "dark:opacity-10 dark:from-blue-400 dark:via-blue-500 dark:to-transparent"
                    )} />
                    
                    <CardHeader className="pb-2 pt-6 relative z-10">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <div className={cn(
                            // Light mode
                            "bg-blue-100 text-blue-700",
                            // Dark mode
                            "dark:bg-blue-800/40 dark:text-blue-300",
                            // Common
                            "p-2 rounded-lg"
                          )}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <CardTitle className={cn(
                            "text-lg font-semibold",
                            // Light mode
                            "text-blue-700",
                            // Dark mode
                            "dark:text-blue-300"
                          )}>
                            {title}
                          </CardTitle>
                        </div>
                      </div>
                      
                      <CardDescription className={cn(
                        "mt-2 text-sm",
                        // Light mode
                        "text-blue-600/80",
                        // Dark mode
                        "dark:text-blue-400/90"
                      )}>
                        {description}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="pt-1 pb-6 relative z-10">
                      <p className={cn(
                        "text-2xl font-bold",
                        // Light mode
                        "text-blue-700",
                        // Dark mode
                        "dark:text-blue-300"
                      )}>
                        {formatCurrency(value)}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </HoverCardTrigger>
              <HoverCardContent 
                align="center" 
                side="bottom"
                className={cn(
                  "w-80 p-4 backdrop-blur-sm",
                  "border border-blue-100 bg-white/90 shadow-lg",
                  "dark:border-blue-700/50 dark:bg-gray-900/95 dark:text-slate-100"
                )}
              >
                {renderYearlyExpensesTooltip()}
              </HoverCardContent>
            </HoverCard>
          ) : (
            <Card 
              className={cn(
                "overflow-hidden transition-all duration-200 cursor-pointer h-full relative",
                // Base styling
                "border shadow-sm hover:shadow-md",
                // Selected state
                selectedPeriod === period && "ring-2 ring-blue-500 dark:ring-blue-400",
                // Light mode
                "bg-white hover:bg-blue-50",
                // Dark mode
                "dark:bg-gray-800/90 dark:hover:bg-blue-900/20 dark:border-blue-800/50"
              )}
              style={{
                boxShadow: selectedPeriod === period 
                  ? (isDarkMode 
                    ? "0 4px 14px -2px rgba(30, 64, 175, 0.35)" 
                    : "0 4px 14px -2px rgba(37, 99, 235, 0.25)")
                  : undefined
              }}
              onClick={() => onPeriodSelect(selectedPeriod === period ? null : period)}
            >
              {/* Ajout du fond radial gradient comme dans RecurringExpensesCategoryChart */}
              <div className={cn(
                "absolute inset-0 opacity-5",
                // Light mode
                "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-400 via-blue-300 to-transparent",
                // Dark mode
                "dark:opacity-10 dark:from-blue-400 dark:via-blue-500 dark:to-transparent"
              )} />
              
              <CardHeader className="pb-2 pt-6 relative z-10">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div className={cn(
                      // Light mode
                      "bg-blue-100 text-blue-700",
                      // Dark mode
                      "dark:bg-blue-800/40 dark:text-blue-300",
                      // Common
                      "p-2 rounded-lg"
                    )}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <CardTitle className={cn(
                      "text-lg font-semibold",
                      // Light mode
                      "text-blue-700",
                      // Dark mode
                      "dark:text-blue-300"
                    )}>
                      {title}
                    </CardTitle>
                  </div>
                </div>
                
                <CardDescription className={cn(
                  "mt-2 text-sm",
                  // Light mode
                  "text-blue-600/80",
                  // Dark mode
                  "dark:text-blue-400/90"
                )}>
                  {description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-1 pb-6 relative z-10">
                <p className={cn(
                  "text-2xl font-bold",
                  // Light mode
                  "text-blue-700",
                  // Dark mode
                  "dark:text-blue-300"
                )}>
                  {formatCurrency(value)}
                </p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
};
