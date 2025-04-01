
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
  LineChart, 
  Line, 
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
interface TrendAnalysisProps {
  period: string;
  dateRange: { start?: Date; end?: Date };
}

// Type pour les données de tendances
interface TrendData {
  date: string;
  expenses: number;
  savings: number;
  investments: number;
  creditPayments: number;
}

export const TrendAnalysis = ({ period, dateRange }: TrendAnalysisProps) => {
  // Récupération des données de tendances
  const { data, isLoading, error } = useQuery({
    queryKey: ['financial-trends', period, dateRange],
    queryFn: async () => {
      const params: any = { period };
      
      if (dateRange.start) {
        params.start_date = dateRange.start.toISOString().split('T')[0];
      }
      
      if (dateRange.end) {
        params.end_date = dateRange.end.toISOString().split('T')[0];
      }
      
      const { data, error } = await supabase.rpc('get_financial_trends', params);
      
      if (error) throw error;
      
      return data as TrendData[] || [];
    },
    refetchOnWindowFocus: false
  });
  
  // Configuration des couleurs pour le graphique
  const chartConfig = {
    expenses: { label: "Dépenses", color: "#ef4444" }, // Rouge
    savings: { label: "Épargne", color: "#22c55e" },  // Vert
    investments: { label: "Investissements", color: "#3b82f6" }, // Bleu
    creditPayments: { label: "Remb. crédits", color: "#f97316" }, // Orange
  };
  
  if (isLoading) {
    return <StyledLoader />;
  }
  
  if (error) {
    return (
      <Card className="col-span-full">
        <CardContent className="pt-6">
          <p className="text-red-500">Erreur lors du chargement des données de tendances</p>
        </CardContent>
      </Card>
    );
  }
  
  // Données simulées pour le graphique des tendances
  const trendData = [
    { 
      date: '2023-01', 
      expenses: 1200, 
      savings: 500, 
      investments: 300, 
      creditPayments: 400 
    },
    { 
      date: '2023-02', 
      expenses: 1300, 
      savings: 550, 
      investments: 320, 
      creditPayments: 400 
    },
    { 
      date: '2023-03', 
      expenses: 1100, 
      savings: 600, 
      investments: 340, 
      creditPayments: 400 
    },
    { 
      date: '2023-04', 
      expenses: 1400, 
      savings: 580, 
      investments: 360, 
      creditPayments: 400 
    },
    { 
      date: '2023-05', 
      expenses: 1350, 
      savings: 620, 
      investments: 350, 
      creditPayments: 400 
    },
    { 
      date: '2023-06', 
      expenses: 1450, 
      savings: 650, 
      investments: 370, 
      creditPayments: 400 
    },
    { 
      date: '2023-07', 
      expenses: 1550, 
      savings: 680, 
      investments: 390, 
      creditPayments: 400 
    },
    { 
      date: '2023-08', 
      expenses: 1600, 
      savings: 700, 
      investments: 400, 
      creditPayments: 400 
    },
    { 
      date: '2023-09', 
      expenses: 1500, 
      savings: 720, 
      investments: 420, 
      creditPayments: 400 
    },
    { 
      date: '2023-10', 
      expenses: 1400, 
      savings: 750, 
      investments: 450, 
      creditPayments: 400 
    },
    { 
      date: '2023-11', 
      expenses: 1350, 
      savings: 770, 
      investments: 470, 
      creditPayments: 400 
    },
    { 
      date: '2023-12', 
      expenses: 1700, 
      savings: 700, 
      investments: 500, 
      creditPayments: 400 
    },
  ];
  
  // Formatage des dates pour l'affichage
  const formatXAxis = (dateString: string) => {
    const [year, month] = dateString.split('-');
    const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
    return `${monthNames[parseInt(month) - 1]}`;
  };

  // Composant personnalisé pour le tooltip
  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium mb-2">{formatXAxis(label)} 2023</p>
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
      {/* Graphique des tendances financières */}
      <Card>
        <CardHeader>
          <CardTitle>Évolution des indicateurs financiers</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatXAxis}
                />
                <YAxis 
                  tickFormatter={(value) => `${value} €`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="expenses" 
                  stroke={chartConfig.expenses.color} 
                  strokeWidth={2} 
                  name="Dépenses"
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="savings" 
                  stroke={chartConfig.savings.color} 
                  strokeWidth={2} 
                  name="Épargne"
                />
                <Line 
                  type="monotone" 
                  dataKey="investments" 
                  stroke={chartConfig.investments.color} 
                  strokeWidth={2} 
                  name="Investissements"
                />
                <Line 
                  type="monotone" 
                  dataKey="creditPayments" 
                  stroke={chartConfig.creditPayments.color} 
                  strokeWidth={2} 
                  name="Remb. crédits"
                  strokeDasharray="3 3"
                />
              </LineChart>
            </ResponsiveContainer>
            <ChartLegend>
              <ChartLegendContent />
            </ChartLegend>
          </ChartContainer>
        </CardContent>
      </Card>
      
      {/* Cartes d'indicateurs de tendances */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Croissance des dépenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500">+12.8%</div>
            <p className="text-sm text-muted-foreground mt-2">
              Par rapport à l'année précédente
            </p>
            <div className="mt-4 space-y-2">
              <p className="text-sm">Principaux facteurs :</p>
              <ul className="text-sm list-disc pl-4 space-y-1">
                <li>Augmentation des prix de l'énergie</li>
                <li>Hausse des charges récurrentes</li>
                <li>Dépenses saisonnières (vacances)</li>
              </ul>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Évolution de l'épargne</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">+8.4%</div>
            <p className="text-sm text-muted-foreground mt-2">
              Par rapport à l'année précédente
            </p>
            <div className="mt-4 space-y-2">
              <p className="text-sm">Faits notables :</p>
              <ul className="text-sm list-disc pl-4 space-y-1">
                <li>Augmentation du taux d'épargne moyen</li>
                <li>Plus de projets d'épargne créés</li>
                <li>Objectifs d'épargne plus ambitieux</li>
              </ul>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Tendance des investissements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-500">+15.2%</div>
            <p className="text-sm text-muted-foreground mt-2">
              Par rapport à l'année précédente
            </p>
            <div className="mt-4 space-y-2">
              <p className="text-sm">Répartition :</p>
              <ul className="text-sm list-disc pl-4 space-y-1">
                <li>Actions : +22% d'utilisateurs actifs</li>
                <li>Immobilier : +8% de nouveaux investissements</li>
                <li>Autres placements : +5% de diversification</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
