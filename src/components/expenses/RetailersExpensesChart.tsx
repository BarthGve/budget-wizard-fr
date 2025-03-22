
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Expense } from "@/types/expense";
import { useState, useMemo, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, Cell } from "recharts";
import { format, parseISO, startOfMonth, endOfMonth, isWithinInterval, getYear } from "date-fns";
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
  viewMode: 'monthly' | 'yearly';
}

export function RetailersExpensesChart({ expenses, retailers, viewMode }: RetailersExpensesChartProps) {
  const [dataVersion, setDataVersion] = useState(0);
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  // Mettre à jour la version des données quand les dépenses ou le mode de visualisation changent
  useEffect(() => {
    setDataVersion(prev => prev + 1);
  }, [expenses, viewMode]);

  // Configurer les couleurs en fonction du thème
  const gridColor = isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)";
  const axisColor = isDarkMode ? "hsl(var(--muted-foreground))" : "hsl(var(--muted-foreground))";
  const barColor = "#3B82F6"; // Couleur principale bleue

  // Générer une palette de couleurs pour les barres empilées
  const getBarColor = (index: number) => {
    const colors = [
      "#3B82F6", // Bleu principal
      "#60A5FA", // Bleu clair
      "#93C5FD", // Bleu très clair
      "#1D4ED8", // Bleu foncé
      "#2563EB", // Bleu moyen
      "#DBEAFE", // Bleu pâle
      "#06B6D4", // Cyan
      "#0284C7", // Bleu-cyan foncé
      "#0EA5E9", // Bleu-cyan clair
      "#38BDF8", // Bleu ciel
    ];
    return colors[index % colors.length];
  };

  // ---- MODE MENSUEL : DÉPENSES PAR ENSEIGNE DU MOIS COURANT ----
  const retailerExpenses = useMemo(() => {
    if (viewMode === 'monthly') {
      const now = new Date();
      const firstDayOfMonth = startOfMonth(now);
      const lastDayOfMonth = endOfMonth(now);

      // Filtrer les dépenses du mois en cours
      const currentMonthExpenses = expenses.filter(expense => {
        const expenseDate = parseISO(expense.date);
        return isWithinInterval(expenseDate, {
          start: firstDayOfMonth,
          end: lastDayOfMonth
        });
      });
      
      // Calculer les dépenses par enseigne
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
    }
    
    return [];
  }, [expenses, retailers, viewMode]);

  // ---- MODE ANNUEL : DÉPENSES ANNUELLES EMPILÉES ----
  const yearlyData = useMemo(() => {
    if (viewMode === 'yearly') {
      // Regrouper les dépenses par année et par enseigne
      const yearlyExpensesByRetailer: Record<string, Record<string, number>> = {};
      
      expenses.forEach(expense => {
        const expenseDate = parseISO(expense.date);
        const year = getYear(expenseDate).toString();
        const retailerId = expense.retailer_id;
        const retailer = retailers.find(r => r.id === retailerId);
        const retailerName = retailer?.name || "Inconnu";
        
        if (!yearlyExpensesByRetailer[year]) {
          yearlyExpensesByRetailer[year] = {};
        }
        
        if (!yearlyExpensesByRetailer[year][retailerName]) {
          yearlyExpensesByRetailer[year][retailerName] = 0;
        }
        
        yearlyExpensesByRetailer[year][retailerName] += expense.amount;
      });
      
      // Transformer les données pour le graphique empilé
      return Object.entries(yearlyExpensesByRetailer)
        .map(([year, retailers]) => ({
          year,
          ...retailers
        }))
        .sort((a, b) => {
          // Conversion explicite des chaînes en nombres pour la comparaison
          return parseInt(a.year, 10) - parseInt(b.year, 10);
        });
    }
    
    return [];
  }, [expenses, retailers, viewMode]);

  // Déterminer les 5 principales enseignes pour la vue annuelle
  const topRetailers = useMemo(() => {
    if (viewMode === 'yearly') {
      // Calculer le total des dépenses par enseigne sur toutes les années
      const totalByRetailer: Record<string, number> = {};
      
      yearlyData.forEach(yearData => {
        Object.entries(yearData).forEach(([key, value]) => {
          if (key !== 'year') {
            if (!totalByRetailer[key]) {
              totalByRetailer[key] = 0;
            }
            totalByRetailer[key] += value as number;
          }
        });
      });
      
      // Trier et retourner les 5 principales enseignes
      return Object.entries(totalByRetailer)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name]) => name);
    }
    
    return [];
  }, [yearlyData, viewMode]);

  // Formatter pour les tooltips
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      if (viewMode === 'monthly') {
        return (
          <div className="bg-background border border-border p-2 rounded-md shadow-md">
            <p className="font-medium">{label}</p>
            <p className="text-sm">
              Total: {formatCurrency(payload[0].value)}
            </p>
          </div>
        );
      } else {
        return (
          <div className="bg-background border border-border p-2 rounded-md shadow-md">
            <p className="font-medium">Année {label}</p>
            {payload.map((entry: any, index: number) => (
              <p key={`item-${index}`} className="text-sm">
                <span style={{ color: entry.color }}>{entry.name}: </span>
                {formatCurrency(entry.value)}
              </p>
            ))}
          </div>
        );
      }
    }
    return null;
  };

  // Si pas de données, afficher un message
  if ((viewMode === 'monthly' && retailerExpenses.length === 0) || 
      (viewMode === 'yearly' && yearlyData.length === 0)) {
    return (
      <Card className="col-span-full bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">
            {viewMode === 'monthly' 
              ? "Dépenses par enseigne (mois en cours)" 
              : "Dépenses annuelles par enseigne"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[250px]">
            <p className="text-muted-foreground">
              {viewMode === 'monthly' 
                ? "Aucune dépense ce mois-ci" 
                : "Aucune donnée annuelle disponible"}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-full bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">
          {viewMode === 'monthly' 
            ? "Dépenses par enseigne (mois en cours)" 
            : "Dépenses annuelles par enseigne"}
        </CardTitle>
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
              {viewMode === 'monthly' ? (
                // Graphique à barres horizontales pour les dépenses mensuelles par enseigne
                <BarChart
                  data={retailerExpenses.map(item => ({
                    name: item.retailerName,
                    total: item.totalAmount
                  }))}
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
              ) : (
                // Graphique à barres empilées pour les dépenses annuelles par enseigne
                <BarChart
                  data={yearlyData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis 
                    dataKey="year"
                    stroke={axisColor}
                    fontSize={12}
                  />
                  <YAxis 
                    tickFormatter={(value) => formatCurrency(value)}
                    stroke={axisColor}
                    fontSize={12}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  {topRetailers.map((retailer, index) => (
                    <Bar 
                      key={retailer}
                      dataKey={retailer} 
                      stackId="a" 
                      fill={getBarColor(index)}
                    />
                  ))}
                </BarChart>
              )}
            </ResponsiveContainer>
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
