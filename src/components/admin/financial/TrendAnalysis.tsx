import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/format';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface TrendData {
  date: string;
  total_revenue: number;
  total_expenses: number;
  total_savings: number;
  total_credits: number;
}

interface TrendAnalysisProps {
  period: 'monthly' | 'quarterly' | 'yearly';
  startDate: string;
  endDate: string;
}

export default function TrendAnalysis({ period, startDate, endDate }: TrendAnalysisProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["financial-trends", period, startDate, endDate],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_financial_trends", {
        period,
        start_date: startDate,
        end_date: endDate,
      });

      if (error) throw error;
      // Conversion sécurisée avec as
      return data as TrendData[];
    },
  });

  if (isLoading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error.message}</div>;

  const chartData = data?.map(item => ({
    date: item.date,
    Revenus: item.total_revenue,
    Dépenses: item.total_expenses,
    Épargne: item.total_savings,
    Crédits: item.total_credits,
  })) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analyse des tendances financières</CardTitle>
        <CardDescription>Évolution des revenus, dépenses, épargne et crédits</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis tickFormatter={(value) => formatCurrency(value as number)} />
            <Tooltip formatter={(value) => formatCurrency(value as number)} />
            <Legend />
            <Line type="monotone" dataKey="Revenus" stroke="#82ca9d" />
            <Line type="monotone" dataKey="Dépenses" stroke="#e45756" />
            <Line type="monotone" dataKey="Épargne" stroke="#8884d8" />
            <Line type="monotone" dataKey="Crédits" stroke="#ffc658" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
