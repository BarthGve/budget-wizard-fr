
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
    <Card className={cn(
      "border shadow-lg overflow-hidden rounded-lg",
      "bg-white dark:bg-gray-800/90", 
      "border-gray-100 dark:border-gray-700/50"
    )}>
      <CardHeader className="pb-2">
        <CardTitle
          className={cn(
            "text-xl font-semibold flex items-center gap-2",
            "text-blue-700 dark:text-blue-300"
          )}
        >
          <div
            className={cn(
              "p-1.5 rounded",
              "bg-blue-100 dark:bg-blue-800/40"
            )}
          >
            <Calendar
              className={cn(
                "w-5 h-5",
                "text-blue-600 dark:text-blue-400"
              )}
            />
          </div>
          Archives des années précédentes
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-0">
        <Tabs defaultValue={yearlyData[0]?.year.toString()} className="w-full">
          <TabsList className={cn(
            "mt-4 mb-4 w-full justify-start overflow-x-auto pb-1",
            "bg-transparent dark:bg-transparent",
            "border-b dark:border-gray-700 border-gray-200"
          )}>
            {yearlyData.map(year => (
              <TabsTrigger 
                key={year.year} 
                value={year.year.toString()}
                onClick={() => handleYearClick(year.year)}
                className={cn(
                  "data-[state=active]:bg-blue-500 data-[state=active]:text-white",
                  "data-[state=active]:shadow-sm",
                  "text-gray-600 dark:text-gray-300",
                  "hover:text-blue-600 dark:hover:text-blue-300", 
                  "data-[state=active]:border-blue-500 dark:data-[state=active]:border-blue-400",
                  "transition-all duration-150"
                )}
              >
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {year.year}
                  <span className={cn(
                    "ml-1 px-1.5 py-0.5 rounded-full text-xs",
                    "bg-blue-100 dark:bg-blue-900/50", 
                    "text-blue-700 dark:text-blue-300"
                  )}>
                    {year.count}
                  </span>
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </CardContent>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent 
          className={cn(
            "p-0 sm:max-w-[650px] w-[95vw] border-0 rounded-lg overflow-hidden",
            "bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800",
            "shadow-lg dark:shadow-gray-900/50"
          )}
        >
          <div className="overflow-y-auto max-h-[80vh] scrollbar-thin">
            <DialogHeader className={cn(
              "p-5 border-b sticky top-0 z-10 backdrop-blur-sm",
              "border-gray-200/70 dark:border-gray-700/50",
              "bg-white/95 dark:bg-gray-900/95"
            )}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "p-2 rounded-lg",
                    "bg-blue-100 dark:bg-blue-900/30",
                    "text-blue-600 dark:text-blue-300"
                  )}>
                    <BarChart className="w-5 h-5" />
                  </div>
                  <DialogTitle className={cn(
                    "text-xl font-bold",
                    "text-blue-800 dark:text-blue-100"
                  )}>
                    Statistiques {selectedYear}
                  </DialogTitle>
                </div>
                
                <DialogClose className={cn(
                  "rounded-full p-1.5 hover:bg-gray-200/20 transition-colors",
                  "text-gray-500 dark:text-gray-400",
                  "hover:text-gray-800 dark:hover:text-gray-200"
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
                        "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/10",
                        "border-blue-100/60 dark:border-blue-800/30"
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
                        "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/10",
                        "border-purple-100/60 dark:border-purple-800/30"
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
                <div className={cn(
                  "rounded-lg p-4 border mt-6",
                  "bg-gray-50 dark:bg-gray-800/30",
                  "border-gray-200 dark:border-gray-700/50"
                )}>
                  <h3 className={cn(
                    "text-lg font-semibold mb-4",
                    "text-gray-800 dark:text-gray-200"
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
                            hasData 
                              ? "bg-white dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700/70" 
                              : "bg-gray-100/40 dark:bg-gray-800/20 border border-gray-200/40 dark:border-gray-700/30",
                            hasData ? "" : "opacity-60"
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <div className={cn(
                              "w-2 h-10 rounded-full",
                              hasData 
                                ? "bg-blue-500 dark:bg-blue-500" 
                                : "bg-gray-300 dark:bg-gray-700"
                            )} />
                            <span className={cn(
                              "text-gray-700 dark:text-gray-300",
                              "font-medium"
                            )}>
                              {monthNames[month]}
                            </span>
                          </div>
                          
                          {hasData ? (
                            <div className="text-right">
                              <p className={cn(
                                "font-semibold",
                                "text-blue-600 dark:text-blue-300"
                              )}>
                                {formatCurrency(data.total)}
                              </p>
                              <p className={cn(
                                "text-xs",
                                "text-gray-500 dark:text-gray-400"
                              )}>
                                {data.count} dépense{data.count > 1 ? 's' : ''}
                              </p>
                            </div>
                          ) : (
                            <span className={cn(
                              "text-sm italic",
                              "text-gray-400 dark:text-gray-500"
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
                <p className={cn(
                  "text-center text-sm", 
                  "text-gray-500 dark:text-gray-400"
                )}>
                  Moyenne par achat: {formatCurrency(selectedYearData.total / selectedYearData.count)}
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
