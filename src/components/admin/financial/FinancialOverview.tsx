
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/format';
import { CreditCard, LineChart, PiggyBank, TrendingUp, ShoppingBag } from 'lucide-react';
import { 
  ChartContainer,
  ChartLegend,
  ChartLegendContent
} from '@/components/ui/chart';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

// Type pour les statistiques financières globales
type FinancialStats = {
  total_expenses: number;
  total_savings: number;
  total_investments: number;
  active_credits: number;
  avg_monthly_expense: number;
  avg_savings_rate: number;
  expense_distribution?: { name: string; value: number }[];
};

// Props du composant
interface FinancialOverviewProps {
  stats: FinancialStats;
}

// Couleurs pour le graphique en camembert
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A67ADB'];

export const FinancialOverview = ({ stats }: FinancialOverviewProps) => {
  // Données pour le graphique de répartition des dépenses
  const pieData = stats.expense_distribution || [
    { name: 'Charges récurrentes', value: 35 },
    { name: 'Alimentation', value: 25 },
    { name: 'Transport', value: 15 },
    { name: 'Loisirs', value: 15 },
    { name: 'Autres', value: 10 }
  ];
  
  // Configuration du chart
  const chartConfig = {
    expenses: { label: "Dépenses", color: "#f97316" },
    savings: { label: "Épargne", color: "#22c55e" },
    investments: { label: "Investissements", color: "#3b82f6" },
    credits: { label: "Crédits", color: "#ef4444" },
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {/* Carte Dépenses totales */}
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base font-medium">Dépenses totales</CardTitle>
            <ShoppingBag className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.total_expenses)}</div>
            <p className="text-xs text-muted-foreground mt-2">
              Moyenne mensuelle: {formatCurrency(stats.avg_monthly_expense)}
            </p>
          </CardContent>
        </Card>

        {/* Carte Épargne totale */}
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base font-medium">Épargne totale</CardTitle>
            <PiggyBank className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.total_savings)}</div>
            <p className="text-xs text-muted-foreground mt-2">
              Taux moyen: {stats.avg_savings_rate.toFixed(1)}%
            </p>
          </CardContent>
        </Card>

        {/* Carte Investissements */}
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base font-medium">Investissements</CardTitle>
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.total_investments)}</div>
            <p className="text-xs text-muted-foreground mt-2">
              Actions, immobilier, etc.
            </p>
          </CardContent>
        </Card>

        {/* Carte Crédits actifs */}
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base font-medium">Crédits actifs</CardTitle>
            <CreditCard className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active_credits}</div>
            <p className="text-xs text-muted-foreground mt-2">
              Montant total des mensualités en cours
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Section Répartition des dépenses */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Répartition des dépenses</CardTitle>
            <CardDescription>Ventilation par catégorie</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={chartConfig} className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name) => [
                      `${value}%`, name
                    ]} 
                  />
                </PieChart>
              </ResponsiveContainer>
              <ChartLegend>
                <ChartLegendContent
                  payload={pieData.map((entry, index) => ({
                    value: entry.name,
                    color: COLORS[index % COLORS.length]
                  }))}
                />
              </ChartLegend>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Résumé financier */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Résumé financier</CardTitle>
            <CardDescription>Principaux indicateurs financiers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Liste des indicateurs financiers clés */}
              <div className="grid gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Ratio dépenses / revenus</span>
                  <span className="font-mono text-sm">68%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Taux d'épargne moyen</span>
                  <span className="font-mono text-sm">{stats.avg_savings_rate.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Répartition par contributeur</span>
                  <span className="font-mono text-sm">2.3 personnes</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Coût moyen du crédit</span>
                  <span className="font-mono text-sm">3.8%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Durée moyenne des crédits</span>
                  <span className="font-mono text-sm">17 ans</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Valeur patrimoniale moyenne</span>
                  <span className="font-mono text-sm">{formatCurrency(245000)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
