
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Expense } from "@/types/expense";
import { useState, useMemo, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { format, parseISO, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";
import { fr } from "date-fns/locale";
import { formatCurrency } from "@/utils/format";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";

interface RetailerExpense {
  retailerId: string;
  retailerName: string;
  totalAmount: number;
}

interface RetailersExpensesChartProps {
  expenses: Expense[];
  retailers: Array<{
    id: string;
    name: string;
  }>;
}

export function RetailersExpensesChart({ expenses, retailers }: RetailersExpensesChartProps) {
  const [dataVersion, setDataVersion] = useState(0);
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  // Mettre à jour la version des données quand les dépenses changent
  useEffect(() => {
    if (expenses) {
      setDataVersion(prev => prev + 1);
    }
  }, [expenses]);

  // Filtrer les dépenses du mois en cours
  const currentMonthExpenses = useMemo(() => {
    const now = new Date();
    const firstDayOfMonth = startOfMonth(now);
    const lastDayOfMonth = endOfMonth(now);

    return expenses.filter(expense => {
      const expenseDate = parseISO(expense.date);
      return isWithinInterval(expenseDate, {
        start: firstDayOfMonth,
        end: lastDayOfMonth
      });
    });
  }, [expenses]);

  // Calculer les dépenses par enseigne
  const retailerExpenses = useMemo(() => {
    // Créer un objet avec les enseignes et leurs dépenses totales
    const expensesByRetailer = currentMonthExpenses.reduce((acc, expense) => {
      const retailerId = expense.retailer_id;
      if (!acc[retailerId]) {
        const retailer = retailers.find(r => r.id === retailerId);
        acc[retailerId] = {
          retailerId,
          retailerName: retailer?.name || "Inconnu",
          totalAmount: 0
        };
      }
      acc[retailerId].totalAmount += expense.amount;
      return acc;
    }, {} as Record<string, RetailerExpense>);

    // Convertir l'objet en tableau et trier par montant total (décroissant)
    return Object.values(expensesByRetailer)
      .sort((a, b) => b.totalAmount - a.totalAmount)
      .slice(0, 10); // Limiter aux 10 premiers pour une meilleure lisibilité
  }, [currentMonthExpenses, retailers]);

  // Configurer les couleurs en fonction du thème
  const gridColor = isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)";
  const axisColor = isDarkMode ? "hsl(var(--muted-foreground))" : "hsl(var(--muted-foreground))";
  const barColor = "#3B82F6"; // Couleur bleue comme demandé

  // Formatter pour les tooltips
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border p-2 rounded-md shadow-md">
          <p className="font-medium">{label}</p>
          <p className="text-sm">
            Total: {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  // Si pas de données, afficher un message
  if (retailerExpenses.length === 0) {
    return (
      <Card className="col-span-full bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Dépenses par enseigne (mois en cours)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[250px]">
            <p className="text-muted-foreground">Aucune dépense ce mois-ci</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Préparer les données pour le graphique
  const chartData = retailerExpenses.map(item => ({
    name: item.retailerName,
    total: item.totalAmount
  }));

  return (
    <Card className="col-span-full bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Dépenses par enseigne (mois en cours)</CardTitle>
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="wait">
          <motion.div
            key={dataVersion}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-[250px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke={gridColor} />
                <XAxis 
                  type="number" 
                  tickFormatter={(value) => formatCurrency(value)}
                  stroke={axisColor}
                  fontSize={12}
                />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  width={100} 
                  stroke={axisColor}
                  fontSize={12}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="total" 
                  fill={barColor} 
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
