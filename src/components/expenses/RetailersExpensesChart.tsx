
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Expense } from "@/types/expense";
import { useState, useMemo, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, Cell, Rectangle } from "recharts";
import { format, parseISO, startOfMonth, endOfMonth, isWithinInterval, getYear } from "date-fns";
import { fr } from "date-fns/locale";
import { formatCurrency } from "@/utils/format";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { BarChart3 } from "lucide-react";

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

// Composant personnalisé pour dessiner les barres avec radius uniquement en haut
const CustomBar = (props: any) => {
  const { x, y, width, height, fill, dataKey, index, payload } = props;
  
  // Déterminer si cette barre est au sommet
  const isTopBar = y === Math.min(...props.yAxis.map((item: any) => item.y));
  
  // Appliquer le radius uniquement à la barre du haut
  const radius = isTopBar ? [4, 4, 0, 0] : [0, 0, 0, 0];
  
  return (
    <Rectangle
      x={x}
      y={y}
      width={width}
      height={height}
      fill={fill}
      radius={radius}
    />
  );
};

export function RetailersExpensesChart({ expenses, retailers, viewMode }: RetailersExpensesChartProps) {
  const [dataVersion, setDataVersion] = useState(0);
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  // État pour suivre l'index de la barre active (survolée)
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Mettre à jour la version des données quand les dépenses ou le mode de visualisation changent
  useEffect(() => {
    setDataVersion(prev => prev + 1);
  }, [expenses, viewMode]);

  // Configurer les couleurs en fonction du thème
  const gridColor = isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)";
  const axisColor = isDarkMode ? "hsl(var(--muted-foreground))" : "hsl(var(--muted-foreground))";
  
  // Générer une palette de couleurs variée pour les barres
  const getColorPalette = () => {
    return [
      // Palette de couleurs distinctes
      {
        light: "#3B82F6", // Bleu
        dark: "#60A5FA"
      },
      {
        light: "#F97316", // Orange
        dark: "#FB923C"
      },
      {
        light: "#9b87f5", // Violet
        dark: "#b19df7"
      },
      {
        light: "#10B981", // Vert
        dark: "#34D399"
      },
      {
        light: "#EF4444", // Rouge
        dark: "#F87171"
      },
      {
        light: "#EC4899", // Rose
        dark: "#F472B6"
      },
      {
        light: "#F59E0B", // Ambre
        dark: "#FBBF24"
      },
      {
        light: "#6366F1", // Indigo
        dark: "#818CF8"
      },
      {
        light: "#0EA5E9", // Cyan
        dark: "#38BDF8"
      },
      {
        light: "#8B5CF6", // Violet foncé
        dark: "#A78BFA"
      }
    ];
  };

  // Obtenir la couleur pour un indice spécifique
  const getBarColor = (index: number) => {
    const palette = getColorPalette();
    const colorSet = palette[index % palette.length];
    
    return isDarkMode ? colorSet.dark : colorSet.light;
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
          const yearA = parseInt(a.year, 10);
          const yearB = parseInt(b.year, 10);
          return yearA - yearB;
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
            // Conversion explicite en nombre avant l'addition
            totalByRetailer[key] += Number(value);
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
      <Card className={cn(
        "overflow-hidden transition-all duration-200 h-full relative",
        "border shadow-sm hover:shadow-md",
        // Light mode
        "bg-white border-blue-100",
        // Dark mode
        "dark:bg-gray-800/90 dark:hover:bg-blue-900/20 dark:border-blue-800/50"
      )}>
        {/* Fond radial gradient */}
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
                <BarChart3 className="h-4 w-4" />
              </div>
              <CardTitle className={cn(
                "text-lg font-semibold",
                // Light mode
                "text-blue-700",
                // Dark mode
                "dark:text-blue-300"
              )}>
                {viewMode === 'monthly' 
                  ? "Dépenses par enseigne (mois en cours)" 
                  : "Dépenses annuelles par enseigne"}
              </CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-1 pb-6 relative z-10">
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

  // Composant personnalisé pour dessiner les barres avec radius uniquement en haut de la pile
  const TopRadiusBar = (props: any) => {
    const { x, y, width, height, fill, isTopOfStack } = props;
    
    // Appliquer le radius uniquement à la barre du haut de la pile
    const radius = isTopOfStack ? [4, 4, 0, 0] : [0, 0, 0, 0];
    
    return (
      <Rectangle
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill}
        radius={radius}
      />
    );
  };

  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-200 relative h-full",
      "border shadow-sm hover:shadow-md",
      // Light mode
      "bg-white border-blue-100",
      // Dark mode
      "dark:bg-gray-800/90 dark:hover:bg-blue-900/20 dark:border-blue-800/50"
    )}>
      {/* Fond radial gradient */}
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
              <BarChart3 className="h-4 w-4" />
            </div>
            <CardTitle className={cn(
              "text-lg font-semibold",
              // Light mode
              "text-blue-700",
              // Dark mode
              "dark:text-blue-300"
            )}>
              {viewMode === 'monthly' 
                ? "Dépenses par enseigne (mois en cours)" 
                : "Dépenses annuelles par enseigne"}
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-1 pb-6 relative z-10 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={dataVersion}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-[280px]"
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
                  margin={{ top: 15, right: 40, left: 20, bottom: 5 }}
                  onMouseMove={(e) => {
                    if (e.activeTooltipIndex !== undefined) {
                      setActiveIndex(e.activeTooltipIndex);
                    }
                  }}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  <XAxis 
                    type="number" 
                    tickFormatter={(value) => formatCurrency(value)} 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: isDarkMode ? '#93C5FD' : '#3B82F6' }}
                  />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    width={120}
                    tickFormatter={(value) => 
                      value.length > 15 ? `${value.substring(0, 15)}...` : value
                    }
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: isDarkMode ? '#93C5FD' : '#3B82F6' }}
                  />
                  <Tooltip 
                    formatter={(value) => [
                      `${formatCurrency(Number(value))}`, 
                      "Montant"
                    ]}
                    labelFormatter={(label) => `Enseigne: ${label}`}
                    contentStyle={{
                      backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      border: isDarkMode ? '1px solid #1e40af' : '1px solid #bfdbfe',
                      color: isDarkMode ? '#bfdbfe' : '#1e40af'
                    }}
                  />
                  <Bar 
                    dataKey="total" 
                    radius={[4, 4, 4, 4]}
                    maxBarSize={30}
                    animationDuration={1000}
                    animationEasing="ease-out"
                  >
                    {retailerExpenses.map((_, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={getBarColor(index)}
                        className="transition-all duration-200"
                      />
                    ))}
                  </Bar>
                </BarChart>
              ) : (
                // Graphique à barres empilées pour les dépenses annuelles par enseigne
                <BarChart
                  data={yearlyData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
                  barGap={2} // Espace réduit entre les groupes de barres pour plus d'élégance
                  barCategoryGap="10%" // Espace entre catégories
                >
                  {/* Masquer les axes tout en conservant leurs fonctionnalités */}
                  <XAxis 
                    dataKey="year"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: axisColor, fontSize: 12 }}
                    dy={10} // Espacement légèrement augmenté
                  />
                  <YAxis 
                    hide={true} // Masquer complètement l'axe Y
                  />
                  
                  {/* Tooltip amélioré */}
                  <Tooltip 
                    content={<CustomTooltip />} 
                    cursor={{ 
                      fill: 'rgba(180, 180, 180, 0.1)' // Curseur très subtil
                    }} 
                  />
                  
                  {/* Légende conservée en bas */}
                  <Legend 
                    wrapperStyle={{ 
                      paddingTop: 15,
                      fontSize: 12,
                      opacity: 0.9
                    }}
                    iconSize={10} // Taille d'icône réduite pour plus d'élégance
                    iconType="circle" // Utilisation de cercles au lieu de rectangles
                  />
                  
                  {/* Barres avec radius uniquement pour la barre du haut */}
                  {topRetailers.map((retailer, index) => {
                    // Pour la dernière barre (celle du haut dans la pile), on applique un radius
                    const isLastBar = index === 0;
                    return (
                      <Bar 
                        key={retailer}
                        dataKey={retailer} 
                        stackId="a" 
                        fill={getBarColor(index)}
                        // Le radius uniquement au sommet
                        radius={isLastBar ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                        maxBarSize={80} // Barres un peu plus fines pour plus d'élégance
                        // Animation personnalisée pour un rendu plus élégant
                        animationDuration={1000}
                        animationEasing="ease-out"
                        // Pour la barres intermédiaires et inférieures, pas de radius
                        isAnimationActive={true}
                      />
                    );
                  })}
                </BarChart>
              )}
            </ResponsiveContainer>
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
