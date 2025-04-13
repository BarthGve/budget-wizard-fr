
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CalendarDays, CalendarRange } from "lucide-react";
import { motion } from "framer-motion";
import { formatCurrency } from "@/utils/format";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

interface RecurringExpensesSummaryCardsProps {
  monthlyTotal: number;
  quarterlyTotal: number;
  yearlyTotal: number;
  onPeriodSelect: (period: "monthly" | "quarterly" | "yearly" | null) => void;
  selectedPeriod: "monthly" | "quarterly" | "yearly" | null;
}

export const RecurringExpensesSummaryCards = ({
  monthlyTotal,
  quarterlyTotal,
  yearlyTotal,
  onPeriodSelect,
  selectedPeriod
}: RecurringExpensesSummaryCardsProps) => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  
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
          period: "yearly" as const
        }
      ].map(({ title, value, description, Icon, index, period }) => (
        <motion.div
          key={title}
          custom={index}
          variants={cardVariants}
          whileHover={{ 
            y: -5, 
            transition: { duration: 0.2 }
          }}
          onClick={() => onPeriodSelect(selectedPeriod === period ? null : period)}
        >
          <Card 
            className={cn(
              "overflow-hidden transition-all duration-200 cursor-pointer h-full relative",
              // Base styling
              "border shadow-lg hover:shadow-xl",
              // Selected state
              selectedPeriod === period && "ring-2 ring-tertiary-500 dark:ring-tertiary-400",
              // Light mode
              "bg-white hover:bg-tertiary-50",
              // Dark mode
              "dark:bg-gray-800/90 dark:hover:bg-tertiary-900/20 dark:border-tertiary-800/50"
            )}
            style={{
              boxShadow: selectedPeriod === period 
                ? (isDarkMode 
                  ? "0 4px 14px -2px rgba(30, 64, 175, 0.35)" 
                  : "0 4px 14px -2px rgba(37, 99, 235, 0.25)")
                : undefined
            }}
          >
     
            
            <CardHeader className="pb-2 pt-6 relative z-10">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className={cn(
                    // Light mode
                    "bg-tertiary-100 text-tertiary-700",
                    // Dark mode
                    "dark:bg-tertiary-800/40 dark:text-tertiary-300",
                    // Common
                    "p-2 rounded-lg"
                  )}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <CardTitle className={cn(
                    "text-lg font-semibold",
                
                  )}>
                    {title}
                  </CardTitle>
                </div>
              </div>
              
              <CardDescription className={cn(
                "mt-2 text-sm",
                // Light mode
                "text-tertiary-600/80",
                // Dark mode
                "dark:text-tertiary-400/90"
              )}>
                {description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-1 pb-6 relative z-10">
              <p className={cn(
                "text-2xl font-bold",
                // Light mode
                "text-tertiary-700",
                // Dark mode
                "dark:text-tertiary-300"
              )}>
                {formatCurrency(value)}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
};
