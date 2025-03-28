
import { useChartDisplay } from "./hooks/useChartDisplay";
import { ChartBackground } from "./components/ChartBackground";
import { EmptyChart } from "./components/EmptyChart";
import { ExpensesChartHeader } from "./components/ExpensesChartHeader";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { useMemo } from "react";
import { Expense } from "@/types/expense";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

interface RetailerExpensesChartProps {
  data?: any[];
  expenses?: Expense[];
  isLoading?: boolean;
  className?: string;
}

export const RetailerExpensesChart = ({ data, expenses, isLoading, className }: RetailerExpensesChartProps) => {
  const { viewMode, isMobileScreen, handleViewModeChange } = useChartDisplay();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  // Préparer les données pour le graphique en fonction du mode (mensuel ou annuel)
  const chartData = useMemo(() => {
    // Si les données sont directement fournies, les utiliser
    if (data && data.length > 0) {
      return data;
    }
    
    // Sinon, construire les données à partir des dépenses
    if (!expenses || expenses.length === 0) {
      return [];
    }

    if (viewMode === 'monthly') {
      // Regrouper par mois
      const monthlyData = expenses.reduce((acc, expense) => {
        const date = parseISO(expense.date);
        const month = format(date, 'MMM yyyy', { locale: fr });
        
        const existingMonth = acc.find(item => item.name === month);
        if (existingMonth) {
          existingMonth.value += expense.amount;
        } else {
          acc.push({ name: month, value: expense.amount });
        }
        
        return acc;
      }, [] as { name: string; value: number }[]);
      
      // Trier par date
      return monthlyData.sort((a, b) => {
        const dateA = new Date(a.name);
        const dateB = new Date(b.name);
        return dateA.getTime() - dateB.getTime();
      });
    } else {
      // Regrouper par année
      const yearlyData = expenses.reduce((acc, expense) => {
        const date = parseISO(expense.date);
        const year = format(date, 'yyyy');
        
        const existingYear = acc.find(item => item.name === year);
        if (existingYear) {
          existingYear.value += expense.amount;
        } else {
          acc.push({ name: year, value: expense.amount });
        }
        
        return acc;
      }, [] as { name: string; value: number }[]);
      
      // Trier par année
      return yearlyData.sort((a, b) => a.name.localeCompare(b.name));
    }
  }, [data, expenses, viewMode]);

  // Formater les données pour l'affichage du montant avec €
  const formatYAxis = (value: number) => `${value}€`;

  if (isLoading) {
    return (
      <div className={cn("relative rounded-xl border p-6 h-[350px] flex items-center justify-center", className)}>
        <div className="animate-pulse flex flex-col gap-2 w-full">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
          <div className="h-[280px] bg-gray-100 dark:bg-gray-800 rounded"></div>
        </div>
      </div>
    );
  }

  if (!chartData || chartData.length === 0) {
    return <EmptyChart className={className} />;
  }

  return (
    <div className={cn("relative rounded-xl border p-6 h-[380px]", className)}>
      <ChartBackground />

      <ExpensesChartHeader 
        viewMode={viewMode} 
        onViewModeChange={handleViewModeChange} 
      />

      <div className="mt-4 h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ 
              top: 10, 
              right: isMobileScreen ? 15 : 35, 
              left: isMobileScreen ? 0 : 10, 
              bottom: 25 
            }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false} 
              stroke={isDarkMode ? "#333" : "#eee"} 
            />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              dy={10}
              tick={{ 
                fontSize: isMobileScreen ? 10 : 12,
                fill: isDarkMode ? '#aaa' : '#666'
              }}
            />
            <YAxis 
              tickFormatter={formatYAxis}
              axisLine={false} 
              tickLine={false}
              dx={isMobileScreen ? -5 : 0}
              width={isMobileScreen ? 40 : 60}
              tick={{ 
                fontSize: isMobileScreen ? 10 : 12,
                fill: isDarkMode ? '#aaa' : '#666'
              }}
            />
            <Tooltip 
              cursor={{ fill: isDarkMode ? 'rgba(30, 41, 59, 0.4)' : 'rgba(241, 245, 249, 0.8)' }}
              contentStyle={{
                backgroundColor: isDarkMode ? '#1e293b' : '#fff',
                borderColor: isDarkMode ? '#334155' : '#e2e8f0',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              }}
              labelStyle={{
                color: isDarkMode ? '#cbd5e1' : '#475569',
                fontWeight: '600',
                marginBottom: '4px',
              }}
              itemStyle={{
                color: isDarkMode ? '#94a3b8' : '#64748b',
                padding: '2px 0',
              }}
              formatter={(value: number) => [`${value}€`, 'Montant']}
            />
            <Bar 
              dataKey="value" 
              fill={isDarkMode ? "#3b82f6" : "#60a5fa"} 
              radius={[4, 4, 0, 0]} 
              maxBarSize={isMobileScreen ? 35 : 50}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
