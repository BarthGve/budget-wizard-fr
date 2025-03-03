
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency } from "@/utils/format";

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

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Archives des années précédentes</h2>
      
      <Tabs defaultValue={yearlyData[0]?.year.toString()}>
        <TabsList className="mb-4">
          {yearlyData.map(year => (
            <TabsTrigger 
              key={year.year} 
              value={year.year.toString()}
              onClick={() => handleYearClick(year.year)}
            >
              {year.year}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Résumé des dépenses {selectedYear}</DialogTitle>
          </DialogHeader>
          
          {selectedYearData && (
            <div className="space-y-4 py-4">
              <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white">
                <CardHeader className="pb-2">
                  <CardTitle>Total des dépenses</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{formatCurrency(selectedYearData.total)}</p>
                  <p className="text-sm opacity-90 mt-1">
                    Répartis sur {selectedYearData.count} achats
                  </p>
                </CardContent>
              </Card>
              
              <p className="text-center text-sm text-muted-foreground">
                Moyenne par achat: {formatCurrency(selectedYearData.total / selectedYearData.count)}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
