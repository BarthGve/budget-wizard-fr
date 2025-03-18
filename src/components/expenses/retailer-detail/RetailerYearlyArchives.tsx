
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency } from "@/utils/format";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { X, BarChart, Receipt, Calendar, TrendingUp, Wallet } from "lucide-react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { motion } from "framer-motion";

interface YearlyData {
  year: number;
  total: number;
  count: number;
}

interface RetailerYearlyArchivesProps {
  expenses: Array<{
    id: string;
    date: string;
    amount: number;
  }>;
  currentYear: number;
}

export function RetailerYearlyArchives({ expenses, currentYear }: RetailerYearlyArchivesProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const { theme } = useTheme();
  const isDarkTheme = theme === "dark";
  const isTablet = useMediaQuery("(min-width: 640px) and (max-width: 1023px)");
  const isMobile = useMediaQuery("(max-width: 639px)");

  // Regrouper les dépenses par année (sauf année courante)
  const yearlyData: YearlyData[] = expenses.reduce((acc, expense) => {
    const expenseYear = new Date(expense.date).getFullYear();
    
    // Exclure l'année courante
    if (expenseYear === currentYear) return acc;
    
    const existingYear = acc.find(y => y.year === expenseYear);
    
    if (existingYear) {
      existingYear.total += expense.amount;
      existingYear.count += 1;
    } else {
      acc.push({
        year: expenseYear,
        total: expense.amount,
        count: 1
      });
    }
    
    return acc;
  }, [] as YearlyData[]);
  
  // Trier les années par ordre décroissant
  yearlyData.sort((a, b) => b.year - a.year);
  
  const handleYearClick = (year: number) => {
    setSelectedYear(year);
    setDialogOpen(true);
  };
  
  const selectedYearData = yearlyData.find(y => y.year === selectedYear);
  
  if (yearlyData.length === 0) {
    return null;
  }

  // Filtrer les dépenses de l'année sélectionnée
  const selectedYearExpenses = expenses.filter(
    expense => new Date(expense.date).getFullYear() === selectedYear
  );

  // Regrouper par mois pour l'année sélectionnée
  const monthlyData = selectedYearExpenses.reduce((acc, expense) => {
    const month = new Date(expense.date).getMonth();
    if (!acc[month]) {
      acc[month] = {
        total: 0,
        count: 0
      };
    }
    acc[month].total += expense.amount;
    acc[month].count += 1;
    return acc;
  }, {} as Record<number, { total: number; count: number }>);

  // Noms des mois
  const monthNames = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];

  return (
    <div className={cn(
      "rounded-lg p-5",
      isDarkTheme 
        ? "bg-gray-800/50 border border-gray-700/50" 
        : "bg-white border border-gray-100 shadow-sm"
    )}>
      <CardTitle
        className={cn(
          "text-xl font-semibold flex items-center gap-2",
          // Light mode
          "text-blue-700",
          // Dark mode
          "dark:text-blue-300"
        )}
      >
        <div
          className={cn(
            "p-1.5 rounded", // Common styles
            // Light mode
            "bg-blue-100",
            // Dark mode
            "dark:bg-blue-800/40"
          )}
        >
          <Calendar
            className={cn(
              "w-5 h-5", // Common styles
              // Light mode
              "text-blue-500",
              // Dark mode
              "dark:text-blue-400"
            )}
          />
        </div>
        Archives des années précédentes
      </CardTitle>
      
      <Tabs defaultValue={yearlyData[0]?.year.toString()} className="w-full mt-2">
        <TabsList className={cn(
          "mb-4 w-full justify-start overflow-x-auto pb-1",
          isDarkTheme 
            ? "bg-gray-800/70 border-b border-gray-700" 
            : "bg-gray-50/70 border-b border-gray-200"
        )}>
          {yearlyData.map(year => (
            <TabsTrigger 
              key={year.year} 
              value={year.year.toString()}
              onClick={() => handleYearClick(year.year)}
              className={cn(
                "data-[state=active]:bg-blue-500 data-[state=active]:text-white",
                "data-[state=active]:shadow-sm",
                isDarkTheme
                  ? "text-gray-300 hover:text-blue-300 data-[state=active]:border-blue-400"
                  : "text-gray-600 hover:text-blue-600 data-[state=active]:border-blue-500",
                "transition-all duration-150"
              )}
            >
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {year.year}
                <span className={cn(
                  "ml-1 px-1.5 py-0.5 rounded-full text-xs",
                  isDarkTheme 
                    ? "bg-blue-900/50 text-blue-300" 
                    : "bg-blue-100 text-blue-700"
                )}>
                  {year.count}
                </span>
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent 
          className={cn(
            "p-0 sm:max-w-[650px] w-[95vw] border-0 rounded-lg overflow-hidden",
            isDarkTheme 
              ? "bg-gradient-to-br from-gray-900 to-gray-800" 
              : "bg-gradient-to-br from-white to-gray-50"
          )}
          style={{
            boxShadow: isDarkTheme 
              ? "0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.4)"
              : "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.04)"
          }}
        >
          <div className="overflow-y-auto max-h-[80vh] scrollbar-thin">
            <DialogHeader className={cn(
              "p-5 border-b sticky top-0 z-10 backdrop-blur-sm",
              isDarkTheme ? "border-gray-700/50 bg-gray-900/95" : "border-gray-200/70 bg-white/95"
            )}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "p-2 rounded-lg",
                    isDarkTheme 
                      ? "bg-blue-900/30 text-blue-300" 
                      : "bg-blue-100 text-blue-600"
                  )}>
                    <BarChart className="w-5 h-5" />
                  </div>
                  <DialogTitle className={cn(
                    "text-xl font-bold",
                    isDarkTheme ? "text-blue-100" : "text-blue-800"
                  )}>
                    Statistiques {selectedYear}
                  </DialogTitle>
                </div>
                
                <DialogClose className={cn(
                  "rounded-full p-1.5 hover:bg-gray-200/20 transition-colors",
                  isDarkTheme ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-800"
                )}>
                  <X className="h-4 w-4" />
                  <span className="sr-only">Fermer</span>
                </DialogClose>
              </div>
            </DialogHeader>
            
            {selectedYearData && (
              <div className="space-y-5 p-5">
                {/* En-tête des statistiques */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Total des dépenses */}
                  <motion.div
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  >
                    <Card 
                      className={cn(
                        "border shadow-sm overflow-hidden",
                        "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/10"
                      )}
                    >
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl text-blue-600 dark:text-blue-300 flex items-center gap-2">
                          <Receipt className="w-4 h-4 opacity-80 text-blue-500 dark:text-blue-300" />
                          Total des dépenses
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xl font-bold text-blue-700 dark:text-blue-100">
                          {formatCurrency(selectedYearData.total)}
                        </p>
                        <p className="text-sm text-blue-500 dark:text-blue-300 mt-1">
                          {selectedYearData.count} dépenses enregistrées
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Statistique des achats mensuels moyens */}
                  <motion.div
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  >
                    <Card 
                      className={cn(
                        "border shadow-sm overflow-hidden",
                        "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/10"
                      )}
                    >
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl text-purple-600 dark:text-purple-300 flex items-center gap-2">
                          <Wallet className="w-4 h-4 opacity-80 text-purple-500 dark:text-purple-300" />
                          Achats mensuels moyens
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xl font-bold text-purple-700 dark:text-purple-100">
                          {formatCurrency(selectedYearData.total / 12)}
                        </p>
                        <p className="text-sm text-purple-500 dark:text-purple-300 mt-1">
                          Moyenne par mois
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>

                {/* Répartition par mois */}
                <div className="bg-gray-50/10 rounded-lg p-4 border border-gray-700/20 mt-6">
                  <h3 className={cn(
                    "text-lg font-semibold mb-4",
                    isDarkTheme ? "text-gray-200" : "text-gray-800"
                  )}>
                    Répartition mensuelle
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {Array.from(Array(12).keys()).map(month => {
                      const data = monthlyData[month];
                      const hasData = !!data;
                      
                      return (
                        <div 
                          key={month} 
                          className={cn(
                            "p-3 rounded-lg flex items-center justify-between",
                            isDarkTheme 
                              ? hasData ? "bg-gray-800/70 border border-gray-700/70" : "bg-gray-800/20 border border-gray-700/30"
                              : hasData ? "bg-white border border-gray-200" : "bg-gray-100/40 border border-gray-200/40",
                            hasData ? "" : "opacity-60"
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <div className={cn(
                              "w-2 h-10 rounded-full",
                              hasData 
                                ? isDarkTheme ? "bg-blue-500" : "bg-blue-500" 
                                : isDarkTheme ? "bg-gray-700" : "bg-gray-300"
                            )} />
                            <span className={cn(
                              isDarkTheme ? "text-gray-300" : "text-gray-700",
                              "font-medium"
                            )}>
                              {monthNames[month]}
                            </span>
                          </div>
                          
                          {hasData ? (
                            <div className="text-right">
                              <p className={cn(
                                "font-semibold",
                                isDarkTheme ? "text-blue-300" : "text-blue-600"
                              )}>
                                {formatCurrency(data.total)}
                              </p>
                              <p className={cn(
                                "text-xs",
                                isDarkTheme ? "text-gray-400" : "text-gray-500"
                              )}>
                                {data.count} dépense{data.count > 1 ? 's' : ''}
                              </p>
                            </div>
                          ) : (
                            <span className={cn(
                              "text-sm italic",
                              isDarkTheme ? "text-gray-500" : "text-gray-400"
                            )}>
                              Aucune
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                {/* Ajout de la section pour la moyenne par achat */}
                <p className="text-center text-sm text-muted-foreground">
                  Moyenne par achat: {formatCurrency(selectedYearData.total / selectedYearData.count)}
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
