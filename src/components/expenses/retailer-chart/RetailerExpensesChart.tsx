
import { useChartDisplay } from "./hooks/useChartDisplay";
import { ChartBackground } from "./components/ChartBackground";
import { EmptyChart } from "./components/EmptyChart";
import { ExpensesChartHeader } from "./components/ExpensesChartHeader";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Expense } from "@/types/expense";

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

  // Si expenses est fourni mais pas data, formater les expenses pour les utiliser comme data
  const chartData = data || (expenses ? formatExpensesForChart(expenses, viewMode) : []);

  // Formater les données pour l'affichage du montant avec €
  const formatYAxis = (value: number) => `${value}€`;

  if (isLoading) {
    return (
      <div className={cn("relative rounded-xl border p-4 h-[350px] flex items-center justify-center", className)}>
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
    <div className={cn("relative rounded-xl border p-4 h-[350px]", className)}>
      <ChartBackground />

      <ExpensesChartHeader 
        viewMode={viewMode} 
        onViewModeChange={handleViewModeChange} 
      />

      <div className="mt-4 h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: isMobileScreen ? 0 : 30, left: isMobileScreen ? -20 : 0, bottom: 0 }}
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
              fontSize={isMobileScreen ? 10 : 12}
              dy={10}
              tick={{
                fill: isDarkMode ? '#aaa' : '#666'
              }}
            />
            <YAxis 
              tickFormatter={formatYAxis}
              axisLine={false} 
              tickLine={false}
              fontSize={isMobileScreen ? 10 : 12}
              dx={isMobileScreen ? -5 : 0}
              width={isMobileScreen ? 40 : 60}
              tick={{
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
              maxBarSize={isMobileScreen ? 40 : 60}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Fonction pour formater les dépenses pour le graphique
function formatExpensesForChart(expenses: Expense[], viewMode: 'monthly' | 'yearly'): any[] {
  if (!expenses || expenses.length === 0) return [];

  if (viewMode === 'monthly') {
    // Grouper par mois pour la vue mensuelle
    const monthlyData: Record<string, number> = {};
    
    expenses.forEach(expense => {
      const date = new Date(expense.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = new Intl.DateTimeFormat('fr-FR', { month: 'long' }).format(date);
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = 0;
      }
      monthlyData[monthKey] += expense.amount;
    });
    
    return Object.entries(monthlyData)
      .map(([key, value]) => {
        const [year, month] = key.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1, 1);
        const name = new Intl.DateTimeFormat('fr-FR', { month: 'long' }).format(date);
        return { name, value };
      })
      .sort((a, b) => {
        const monthA = new Intl.DateTimeFormat('fr-FR', { month: 'long' }).format(new Date(`${a.name} 1, 2000`));
        const monthB = new Intl.DateTimeFormat('fr-FR', { month: 'long' }).format(new Date(`${b.name} 1, 2000`));
        return monthA.localeCompare(monthB, 'fr');
      });
  } else {
    // Grouper par année pour la vue annuelle
    const yearlyData: Record<string, number> = {};
    
    expenses.forEach(expense => {
      const year = new Date(expense.date).getFullYear().toString();
      if (!yearlyData[year]) {
        yearlyData[year] = 0;
      }
      yearlyData[year] += expense.amount;
    });
    
    return Object.entries(yearlyData)
      .map(([year, value]) => ({ name: year, value }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }
}
