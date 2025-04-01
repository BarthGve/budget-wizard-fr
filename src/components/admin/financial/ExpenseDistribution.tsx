
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ChartContainer,
  ChartLegend,
  ChartLegendContent
} from '@/components/ui/chart';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  TooltipProps
} from 'recharts';
import StyledLoader from '@/components/ui/StyledLoader';
import { formatCurrency } from '@/utils/format';

// Type des propriétés
interface ExpenseDistributionProps {
  period: string;
  dateRange: { start?: Date; end?: Date };
}

// Type pour les données de distribution des dépenses
interface ExpenseData {
  monthlyData: {
    name: string;
    expenses: number;
    recurring: number;
    other: number;
  }[];
  userExpenseData: {
    name: string;
    expenses: number;
  }[];
}

export const ExpenseDistribution = ({ period, dateRange }: ExpenseDistributionProps) => {
  // Récupération des données de répartition des dépenses
  const { data, isLoading, error } = useQuery({
    queryKey: ['expense-distribution', period, dateRange],
    queryFn: async () => {
      const params: any = { period };
      
      if (dateRange.start) {
        params.start_date = dateRange.start.toISOString().split('T')[0];
      }
      
      if (dateRange.end) {
        params.end_date = dateRange.end.toISOString().split('T')[0];
      }
      
      const { data, error } = await supabase.rpc('get_expense_distribution', params);
      
      if (error) throw error;
      
      return data as ExpenseData || { monthlyData: [], userExpenseData: [] };
    },
    refetchOnWindowFocus: false
  });
  
  // Configuration des couleurs pour le graphique
  const chartConfig = {
    expenses: { label: "Dépenses", color: "#f97316" },
    recurring: { label: "Récurrentes", color: "#22c55e" },
    other: { label: "Autres", color: "#3b82f6" },
  };
  
  if (isLoading) {
    return <StyledLoader />;
  }
  
  if (error) {
    return (
      <Card className="col-span-full">
        <CardContent className="pt-6">
          <p className="text-red-500">Erreur lors du chargement des données de dépenses</p>
        </CardContent>
      </Card>
    );
  }
  
  // Données simulées pour le graphique des dépenses par catégorie
  const categoryData = [
    { name: 'Alimentation', value: 28 },
    { name: 'Logement', value: 32 },
    { name: 'Transport', value: 18 },
    { name: 'Loisirs', value: 12 },
    { name: 'Santé', value: 5 },
    { name: 'Autres', value: 5 },
  ];
  
  // Données simulées pour le graphique des dépenses mensuelles
  const monthlyData = [
    { name: 'Jan', expenses: 1200, recurring: 800, other: 400 },
    { name: 'Fév', expenses: 1300, recurring: 800, other: 500 },
    { name: 'Mar', expenses: 1400, recurring: 800, other: 600 },
    { name: 'Avr', expenses: 1300, recurring: 800, other: 500 },
    { name: 'Mai', expenses: 1500, recurring: 800, other: 700 },
    { name: 'Juin', expenses: 1600, recurring: 800, other: 800 },
    { name: 'Juil', expenses: 1800, recurring: 800, other: 1000 },
    { name: 'Août', expenses: 1700, recurring: 800, other: 900 },
    { name: 'Sep', expenses: 1400, recurring: 800, other: 600 },
    { name: 'Oct', expenses: 1300, recurring: 800, other: 500 },
    { name: 'Nov', expenses: 1200, recurring: 800, other: 400 },
    { name: 'Déc', expenses: 1500, recurring: 800, other: 700 },
  ];
  
  // Données pour le graphique de dépenses par utilisateur (Top 10)
  const userExpenseData = [
    { name: 'Utilisateur 1', expenses: 3500 },
    { name: 'Utilisateur 2', expenses: 2800 },
    { name: 'Utilisateur 3', expenses: 2600 },
    { name: 'Utilisateur 4', expenses: 2400 },
    { name: 'Utilisateur 5', expenses: 2200 },
    { name: 'Utilisateur 6', expenses: 2000 },
    { name: 'Utilisateur 7', expenses: 1800 },
    { name: 'Utilisateur 8', expenses: 1600 },
    { name: 'Utilisateur 9', expenses: 1400 },
    { name: 'Utilisateur 10', expenses: 1200 },
  ];

  // Composant personnalisé pour le tooltip
  const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          {payload.map((p, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: p.color }}
              />
              <span>{p.name}: {formatCurrency(p.value as number)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Graphique des dépenses mensuelles */}
      <Card>
        <CardHeader>
          <CardTitle>Évolution des dépenses mensuelles</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis 
                  tickFormatter={(value) => `${value} €`} 
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="expenses" stackId="a" fill={chartConfig.expenses.color} name="Total" />
                <Bar dataKey="recurring" stackId="b" fill={chartConfig.recurring.color} name="Récurrentes" />
                <Bar dataKey="other" stackId="b" fill={chartConfig.other.color} name="Autres" />
              </BarChart>
            </ResponsiveContainer>
            <ChartLegend>
              <ChartLegendContent />
            </ChartLegend>
          </ChartContainer>
        </CardContent>
      </Card>
      
      {/* Graphique des dépenses par utilisateur */}
      <Card>
        <CardHeader>
          <CardTitle>Top 10 utilisateurs par dépenses</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={userExpenseData} 
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" tickFormatter={(value) => `${value} €`} />
                <YAxis type="category" dataKey="name" width={120} />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="expenses" 
                  fill={chartConfig.expenses.color} 
                  barSize={20} 
                  name="Dépenses"
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
      
      {/* Statistiques des dépenses */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Répartition par catégorie d'achats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryData.map((item, index) => (
                <div key={index} className="flex flex-col gap-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{item.name}</span>
                    <span className="text-sm">{item.value}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary" 
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Statistiques clés des dépenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Dépense moyenne par utilisateur</span>
                  <span className="font-mono text-sm">{formatCurrency(1450)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Montant moyen par achat</span>
                  <span className="font-mono text-sm">{formatCurrency(58)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Dépense récurrente moyenne</span>
                  <span className="font-mono text-sm">{formatCurrency(810)}/mois</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Taux de croissance annuel</span>
                  <span className="font-mono text-sm">+4.2%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Magasins les plus fréquentés</span>
                  <span className="font-mono text-sm">Carrefour, Amazon</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Jours de fortes dépenses</span>
                  <span className="font-mono text-sm">Samedi, 1er du mois</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
