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
              "overflow-hidden transition-all duration-200 cursor-pointer h-full border-0",
              // Base styling
              "shadow-sm hover:shadow-md",
              // Selected state
              selectedPeriod === period && "ring-2 ring-blue-500/50 dark:ring-blue-400/50",
              // Background
              "bg-gradient-to-b from-white to-gray-50/80",
              "dark:from-gray-800 dark:to-gray-900/90"
            )}
            style={{
              boxShadow: selectedPeriod === period 
                ? (isDarkMode 
                  ? "0 4px 14px -2px rgba(30, 64, 175, 0.35)" 
                  : "0 4px 14px -2px rgba(37, 99, 235, 0.25)")
                : (isDarkMode 
                  ? "0 2px 10px -2px rgba(0, 0, 0, 0.2)" 
                  : "0 2px 10px -2px rgba(0, 0, 0, 0.1)")
            }}
          >
            {/* Gradient overlay at the top for more depth */}
            <div className={cn(
              "absolute top-0 left-0 right-0 h-8",
              "bg-gradient-to-b from-blue-50/50 to-transparent",
              "dark:from-blue-900/20 dark:to-transparent"
            )} />
            
            <CardHeader className={cn(
              "pb-2 pt-6 relative overflow-hidden",
              selectedPeriod === period && "pb-1"
            )}>
              {/* Card background pattern - subtle grid */}
              <div className={cn(
                "absolute inset-0 opacity-[0.03] pointer-events-none",
                "dark:opacity-[0.05]"
              )} 
              style={{
                backgroundImage: isDarkMode
                  ? "radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.15) 1px, transparent 0)"
                  : "radial-gradient(circle at 1px 1px, rgba(0, 0, 0, 0.15) 1px, transparent 0)",
                backgroundSize: "20px 20px"
              }}
              />
              
              {/* Decorative circle */}
              <div className={cn(
                "absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 rounded-full opacity-10",
                // Light mode gradient
                "bg-gradient-to-br from-blue-500 to-blue-600",
                // Dark mode gradient
                "dark:from-blue-400 dark:to-blue-500 dark:opacity-15"
              )} />
              
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className={cn(
                    "flex items-center justify-center",
                    "w-8 h-8", // Fixed dimensions for better alignment
                    "rounded-md",  // Less rounded for more modern look
                    // Light mode
                    "bg-gradient-to-br from-blue-50 to-blue-100",
                    // Dark mode
                    "dark:bg-gradient-to-br dark:from-blue-900/40 dark:to-blue-800/30",
                    // Shadow
                    "shadow-sm"
                  )}>
                    <Icon className={cn(
                      "h-4 w-4",
                      "text-blue-600",
                      "dark:text-blue-400"
                    )} />
                  </div>
                  <CardTitle className={cn(
                    "text-lg font-semibold",
                    // Light mode
                    "text-gray-800",
                    // Dark mode
                    "dark:text-gray-200"
                  )}>
                    {title}
                  </CardTitle>
                </div>
              </div>
              
              <CardDescription className={cn(
                "mt-2 text-sm",
                // Light mode
                "text-gray-500",
                // Dark mode
                "dark:text-gray-400"
              )}>
                {description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className={cn(
              "pt-1 pb-6 relative",
              // Selected styles - add highlight border
              selectedPeriod === period && "pt-3"
            )}>
              {/* Highlight line for selected state */}
              {selectedPeriod === period && (
                <div className={cn(
                  "absolute top-0 left-8 right-8 h-px",
                  "bg-gradient-to-r from-transparent via-blue-400/30 to-transparent",
                  "dark:via-blue-400/20"
                )} />
              )}
              
              <p className={cn(
                "text-2xl font-bold",
                // Light mode - with gradient text
                "bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-700",
                // Dark mode
                "dark:from-blue-400 dark:to-blue-300"
              )}>
                {formatCurrency(value)}
              </p>
              
              {/* Subtle indicator for selected state */}
              {selectedPeriod === period && (
                <div className="mt-3 text-xs font-medium text-blue-600 dark:text-blue-400 flex items-center">
                  <div className="h-1 w-1 rounded-full bg-blue-500 dark:bg-blue-400 mr-1.5" />
                  Sélectionné
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
};
