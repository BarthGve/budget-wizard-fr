
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
  Cell
} from 'recharts';
import StyledLoader from '@/components/ui/StyledLoader';
import { formatCurrency } from '@/utils/format';
import { ExpenseData } from '@/types/supabase-rpc';

interface ExpenseDistributionProps {
  period: string;
  dateRange: { start?: Date; end?: Date };
}

export const ExpenseDistribution = ({ period, dateRange }: ExpenseDistributionProps) => {
  // Requête pour récupérer les données de distribution des dépenses
  const { data, isLoading, error } = useQuery({
    queryKey: ['expense-distribution', period, dateRange],
    queryFn: async () => {
      // Construire la plage de dates pour la requête
      let params: any = { period };
      
      if (dateRange.start) {
        params.start_date = dateRange.start.toISOString().split('T')[0];
      }
      
      if (dateRange.end) {
        params.end_date = dateRange.end.toISOString().split('T')[0];
      }
      
      const { data, error } = await supabase.rpc('get_expense_distribution', params);
      
      if (error) throw error;
      
      // Si data est null ou undefined, renvoyer des données par défaut
      if (!data) {
        return {
          monthlyData: [],
          userExpenseData: []
        } as ExpenseData;
      }
      
      // Conversion explicite du JSON retourné en ExpenseData
      return data.result as ExpenseData;
    },
    refetchOnWindowFocus: false
  });
  
  // Couleurs pour le graphique
  const barColors = {
    expenses: "#ef4444", // Rouge
    recurring: "#22c55e", // Vert
    other: "#3b82f6", // Bleu
  };
  
  // Couleurs pour le graphique en camembert des utilisateurs
  const userColors = [
    "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A67ADB",
    "#FF4560", "#775DD0", "#3FA796", "#FFC75F", "#FF6B6B"
  ];
  
  if (isLoading) {
    return <StyledLoader />;
  }
  
  if (error) {
    return (
      <Card className="col-span-full">
        <CardContent className="pt-6">
          <p className="text-red-500">Erreur lors du chargement des données de distribution</p>
        </CardContent>
      </Card>
    );
  }
  
  // Données par défaut si pas de données
  const monthlyData = data?.monthlyData || [];
  const userExpenseData = data?.userExpenseData || [];

  // Composant personnalisé pour le tooltip
  const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium mb-2">{payload[0].payload.name}</p>
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
          <CardTitle>Dépenses mensuelles vs Dépenses récurrentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `${value} €`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="expenses" name="Dépenses totales" fill={barColors.expenses} />
                <Bar dataKey="recurring" name="Dépenses récurrentes" fill={barColors.recurring} />
                <Bar dataKey="other" name="Autres dépenses" fill={barColors.other} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: barColors.expenses }} />
              <span className="text-sm">Dépenses totales</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: barColors.recurring }} />
              <span className="text-sm">Dépenses récurrentes</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: barColors.other }} />
              <span className="text-sm">Autres dépenses</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Graphique des dépenses par utilisateur */}
      <Card>
        <CardHeader>
          <CardTitle>Dépenses par utilisateur (Top 10)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={userExpenseData}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 120, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" tickFormatter={(value) => `${value} €`} />
                <YAxis type="category" dataKey="name" width={120} />
                <Tooltip formatter={(value) => [`${formatCurrency(value as number)}`, "Dépenses"]} />
                <Bar dataKey="expenses" name="Dépenses" radius={[0, 4, 4, 0]}>
                  {userExpenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={userColors[index % userColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
