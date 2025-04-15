
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { subYears, format, parseISO, isWithinInterval, startOfYear, endOfYear, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { fr } from "date-fns/locale";
import { formatCurrency } from "@/utils/format";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

interface Expense {
  id: string;
  date: string;
  amount: number;
}

interface ExpensesChartProps {
  expenses: Expense[];
  viewMode: 'monthly' | 'yearly';
}

// Nouvelle configuration des couleurs du graphique avec du bleu
const chartConfig = {
  expenses: {
    label: "Dépenses",
    theme: {
      light: "#73767a", // Bleu plus vif qui correspond à l'image de référence
      dark: "#60A5FA"
    }
  }
};

export function ExpensesChart({ expenses, viewMode }: ExpensesChartProps) {
  // État pour suivre la version des données pour les animations
  const [dataVersion, setDataVersion] = useState(0);
  const today = new Date();
  const startOfCurrentYear = startOfYear(today);
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  // Surveiller les changements dans les dépenses pour déclencher l'animation
  useEffect(() => {
    setDataVersion(prev => prev + 1);
  }, [expenses]);

  const chartData = useMemo(() => {
    if (viewMode === 'monthly') {
      const last12Months = Array.from({ length: 12 }, (_, i) => {
        const month = subMonths(today, i);
        const monthExpenses = expenses.filter(expense => {
          const expenseDate = parseISO(expense.date);
          return isWithinInterval(expenseDate, {
            start: startOfMonth(month),
            end: endOfMonth(month)
          });
        });
        return {
          period: format(month, 'MMM yyyy', { locale: fr }),
          total: monthExpenses.reduce((sum, expense) => sum + expense.amount, 0),
          rawDate: month,
        };
      }).reverse();

      return last12Months;
    } else {
      const fiveYearsAgo = subYears(today, 5);
      const yearlyExpenses = expenses
        .filter((expense) => {
          const expenseDate = parseISO(expense.date);
          return isWithinInterval(expenseDate, {
            start: startOfYear(fiveYearsAgo),
            end: endOfYear(today),
          });
        })
        .reduce((acc: { [key: string]: number }, expense) => {
          const year = format(parseISO(expense.date), "yyyy");
          acc[year] = (acc[year] || 0) + expense.amount;
          return acc;
        }, {});

      return Object.entries(yearlyExpenses)
        .map(([year, total]) => ({
          period: year,
          total,
          rawDate: new Date(parseInt(year), 0, 1),
        }))
        .sort((a, b) => a.rawDate.getTime() - b.rawDate.getTime());
    }
  }, [expenses, viewMode, today]);

  if (chartData.length === 0) {
    return null;
  }

  // Configurez les couleurs en fonction du thème
  const gridColor = isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)";
  const axisColor = isDarkMode ? "hsl(var(--muted-foreground))" : "hsl(var(--muted-foreground))";
  const backgroundColor = "transparent"; // Rendre le fond transparent pour qu'il prenne la couleur de la carte

  return (
    <div className="rounded-lg p-2 mt-2">
      <AnimatePresence mode="wait">
        <motion.div
          key={dataVersion}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.3 }}
          className="w-full h-full"
        >
          <ChartContainer 
            className={cn(
              "h-[250px] w-full p-0",
              // Supprimer toute classe bg- ou background-
            )} 
            config={chartConfig}
            style={{ background: backgroundColor }} // Rendre le fond transparent
          >
            <ResponsiveContainer width="100%" height="100%" >
              <BarChart 
                data={chartData} 
                margin={{ top: 0, right: 0, left: 0, bottom: 20 }}
                style={{ background: backgroundColor }} // Rendre le fond transparent
              >
                <CartesianGrid vertical={false} stroke={gridColor} opacity={0.1} />
                <XAxis 
                  dataKey="period"
                  axisLine={false}
                  tickLine={false}
                  stroke={axisColor}
                  fontSize={12}
                  tickMargin={10}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent 
                      formatter={(value: number) => formatCurrency(value)}
                      labelFormatter={(label) => viewMode === 'yearly' ? `Année ${label}` : label}
                    />
                  }
                />
                <Bar 
                  dataKey="total" 
                  fill="#60A5FA" // Remplace le violet par un bleu qui correspond à l'image
                  radius={[4, 4, 0, 0]}
                  maxBarSize={50}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
