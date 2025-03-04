
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ExpensesChart } from "@/components/expenses/ExpensesChart";
import { Calendar, BarChart3 } from "lucide-react";

interface Expense {
  id: string;
  date: string;
  amount: number;
  comment?: string;
  retailer_id: string;
}

interface RetailerExpensesChartProps {
  expenses: Expense[];
}

export function RetailerExpensesChart({ expenses }: RetailerExpensesChartProps) {
  const [viewMode, setViewMode] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold">Évolution des dépenses</h2>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <Calendar className={`h-4 w-4 ${viewMode === 'monthly' ? 'text-primary' : 'text-muted-foreground'}`} />
            <Label htmlFor="chart-view-mode" className={viewMode === 'monthly' ? 'text-primary' : 'text-muted-foreground'}>
              Mensuel
            </Label>
          </div>
          
          <Switch
            id="chart-view-mode"
            checked={viewMode === 'yearly'}
            onCheckedChange={(checked) => setViewMode(checked ? 'yearly' : 'monthly')}
          />
          
          <div className="flex items-center space-x-2">
            <Label htmlFor="chart-view-mode" className={viewMode === 'yearly' ? 'text-primary' : 'text-muted-foreground'}>
              Annuel
            </Label>
            <BarChart3 className={`h-4 w-4 ${viewMode === 'yearly' ? 'text-primary' : 'text-muted-foreground'}`} />
          </div>
        </div>
      </div>
      
      {expenses.length > 0 ? (
          <div className="h-[150px]"> {/* Ajout de la hauteur fixe */}
        <ExpensesChart expenses={expenses} viewMode={viewMode} />
        </div>
      ) : (
        <p className="text-center py-8 text-muted-foreground">
          Aucune donnée disponible pour afficher l'évolution des dépenses
        </p>
      )}
    </Card>
  );
}
