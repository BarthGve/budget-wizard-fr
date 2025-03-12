import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Card } from '@/components/ui/card';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { formatCurrency } from '@/lib/formatters';

ChartJS.register(ArcElement, Tooltip, Legend);

interface ExpensesChartProps {
  totalExpenses: number;
  totalCredits: number;
}

export const ExpensesChart = ({ totalExpenses, totalCredits }: ExpensesChartProps) => {
  const { theme } = useTheme();
  const isDarkTheme = theme === 'dark';

  // Couleurs cohérentes avec votre design
  const expensesColor = '#FFCA28'; // Jaune ambré pour les charges
  const creditsColor = '#FFA726';  // Orange plus foncé pour les crédits

  // S'assurer qu'on a des données à afficher
  const expensesValue = Math.max(0, totalExpenses);
  const creditsValue = Math.max(0, totalCredits);
  const total = expensesValue + creditsValue;

  if (total === 0) return null;

  const data = {
    labels: ['Charges', 'Crédits'],
    datasets: [
      {
        data: [expensesValue, creditsValue],
        backgroundColor: [expensesColor, creditsColor],
        borderColor: isDarkTheme ? '#1A1E2A' : '#FFFFFF',
        borderWidth: 2,
        borderRadius: 6, // Ajout du radius pour arrondir les segments
        hoverOffset: 4,
        cutout: '70%',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const value = context.raw;
            const percentage = Math.round((value / total) * 100);
            return `${context.label}: ${formatCurrency(value)} (${percentage}%)`;
          }
        }
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      <Card className={cn(
        "p-4 shadow-md",
        "bg-white border border-gray-100",
        "dark:bg-gray-900/95 dark:border-gray-800 dark:shadow-lg dark:shadow-gray-900/30"
      )}>
        <div className="flex flex-col items-center space-y-6">
          <div className="h-64 w-full relative">
            <Doughnut data={data} options={options} />
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-6 w-full">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: expensesColor }}></div>
              <span className={cn(
                "text-sm font-medium", 
                "text-gray-800 dark:text-gray-200"
              )}>
                Charges ({formatCurrency(expensesValue)})
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: creditsColor }}></div>
              <span className={cn(
                "text-sm font-medium", 
                "text-gray-800 dark:text-gray-200"
              )}>
                Crédits ({formatCurrency(creditsValue)})
              </span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
