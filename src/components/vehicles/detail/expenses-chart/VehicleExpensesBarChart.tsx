
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { format, parseISO, startOfYear, endOfYear } from "date-fns";
import { fr } from "date-fns/locale";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useState, useEffect, useMemo } from "react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { formatCurrency } from "@/utils/format";
import { BarChart as BarChartIcon } from "lucide-react";

interface VehicleExpensesBarChartProps {
  vehicleId: string;
}

// Configuration des couleurs du graphique
const chartConfig = {
  carburant: {
    label: "Carburant",
    theme: {
      light: "#6B7280", // Gray-500
      dark: "#9CA3AF"   // Gray-400
    }
  },
  entretien: {
    label: "Entretien",
    theme: {
      light: "#4B5563", // Gray-600
      dark: "#D1D5DB"   // Gray-300
    }
  },
  assurance: {
    label: "Assurance",
    theme: {
      light: "#374151", // Gray-700
      dark: "#F3F4F6"   // Gray-100
    }
  },
  reparation: {
    label: "Réparation",
    theme: {
      light: "#1F2937", // Gray-800
      dark: "#E5E7EB"   // Gray-200
    }
  },
  autre: {
    label: "Autre",
    theme: {
      light: "#111827", // Gray-900
      dark: "#F9FAFB"   // Gray-50
    }
  }
};

export const VehicleExpensesBarChart = ({ vehicleId }: VehicleExpensesBarChartProps) => {
  const [dataVersion, setDataVersion] = useState(0);
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const currentYear = new Date().getFullYear();

  // Requête pour récupérer les dépenses du véhicule
  const { data: expenses, isLoading } = useQuery({
    queryKey: ["vehicle-expenses-chart", vehicleId],
    queryFn: async () => {
      const startDate = startOfYear(new Date(currentYear, 0, 1));
      const endDate = endOfYear(new Date(currentYear, 11, 31));
      
      const { data, error } = await supabase
        .from("vehicle_expenses")
        .select("*")
        .eq("vehicle_id", vehicleId)
        .gte("date", startDate.toISOString().split("T")[0])
        .lte("date", endDate.toISOString().split("T")[0])
        .order("date", { ascending: true });

      if (error) {
        console.error("Erreur lors de la récupération des dépenses:", error);
        return [];
      }

      return data;
    },
    enabled: !!vehicleId,
  });

  // Mettre à jour la version des données quand les dépenses changent
  useEffect(() => {
    if (expenses) {
      setDataVersion(prev => prev + 1);
    }
  }, [expenses]);

  // Transformer les données pour le graphique
  const chartData = useMemo(() => {
    if (!expenses || expenses.length === 0) return [];

    // Initialiser les données pour chaque mois
    const monthsData = Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;
      return {
        month: month,
        name: format(new Date(currentYear, i, 1), 'MMM', { locale: fr }),
        carburant: 0,
        entretien: 0,
        assurance: 0,
        reparation: 0,
        autre: 0
      };
    });

    // Remplir les données avec les dépenses existantes
    expenses.forEach(expense => {
      const date = parseISO(expense.date);
      const monthIndex = date.getMonth();
      
      // Mapper le type de dépense à la catégorie correspondante
      const expenseType = expense.expense_type.toLowerCase();
      
      if (expenseType === "carburant") {
        monthsData[monthIndex].carburant += expense.amount;
      } else if (expenseType === "entretien") {
        monthsData[monthIndex].entretien += expense.amount;
      } else if (expenseType === "assurance") {
        monthsData[monthIndex].assurance += expense.amount;
      } else if (expenseType === "reparation") {
        monthsData[monthIndex].reparation += expense.amount;
      } else {
        monthsData[monthIndex].autre += expense.amount;
      }
    });

    return monthsData;
  }, [expenses, currentYear]);

  // Configuration des couleurs en fonction du thème
  const gridColor = isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)";
  const axisColor = isDarkMode ? "hsl(var(--muted-foreground))" : "hsl(var(--muted-foreground))";
  const backgroundColor = "transparent";

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8 h-[250px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-500"></div>
      </div>
    );
  }

  if (!expenses || expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground space-y-2 h-[250px]">
        <BarChartIcon className="h-12 w-12 text-gray-200 dark:text-gray-700" />
        <p className="text-center text-gray-500 dark:text-gray-400">
          Aucune dépense enregistrée pour cette année
        </p>
      </div>
    );
  }

  return (
    <motion.div
      key={dataVersion}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3 }}
    >
      <ChartContainer 
        className="h-[350px] w-full p-0"
        config={chartConfig}
        style={{ background: backgroundColor }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={chartData}
            margin={{ top: 10, right: 10, left: 10, bottom: 30 }}
            style={{ background: backgroundColor }}
          >
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              stroke={axisColor}
              fontSize={12}
              tickMargin={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              stroke={axisColor}
              fontSize={12}
              tickFormatter={(value) => formatCurrency(value, 0)}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent 
                  formatter={(value: number) => formatCurrency(value)}
                  labelFormatter={(label) => `${label} ${currentYear}`}
                />
              }
            />
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              formatter={(value) => {
                const categoryConfig = chartConfig[value as keyof typeof chartConfig];
                return categoryConfig ? categoryConfig.label : value;
              }} 
            />
            <Bar 
              dataKey="carburant" 
              stackId="a" 
              radius={[0, 0, 0, 0]}
              maxBarSize={60}
            />
            <Bar 
              dataKey="entretien" 
              stackId="a" 
              radius={[0, 0, 0, 0]}
              maxBarSize={60}
            />
            <Bar 
              dataKey="assurance" 
              stackId="a" 
              radius={[0, 0, 0, 0]}
              maxBarSize={60}
            />
            <Bar 
              dataKey="reparation" 
              stackId="a" 
              radius={[0, 0, 0, 0]}
              maxBarSize={60}
            />
            <Bar 
              dataKey="autre" 
              stackId="a" 
              radius={[4, 4, 0, 0]}
              maxBarSize={60}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </motion.div>
  );
};
