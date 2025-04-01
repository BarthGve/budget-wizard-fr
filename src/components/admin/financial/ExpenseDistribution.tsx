
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { DateRangePicker } from "@/components/admin/financial/DateRangePicker";
import { format } from 'date-fns';

// Définition des types pour les données
interface ExpenseData {
  category: string;
  total_amount: number;
}

interface ExpenseDistributionProps {
  period: 'monthly' | 'quarterly' | 'yearly';
  startDate: string;
  endDate: string;
}

export default function ExpenseDistribution({ period, startDate, endDate }: ExpenseDistributionProps) {
  const [selectedDates, setSelectedDates] = React.useState<{
    start: Date | undefined;
    end: Date | undefined;
  } | undefined>({
    start: startDate ? new Date(startDate) : undefined,
    end: endDate ? new Date(endDate) : undefined,
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["expense-distribution", period, startDate, endDate],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_expense_distribution", {
        period,
        start_date: startDate,
        end_date: endDate,
      });

      if (error) throw error;
      // Conversion sécurisée avec as
      return data as unknown as ExpenseData[];
    },
  });

  if (isLoading) return <p>Chargement...</p>;
  if (error) return <p>Erreur: {(error as Error).message}</p>;

  // Préparer les données pour le graphique
  const chartData = data ? data.map(item => ({
    category: item.category,
    total_amount: Number(item.total_amount),
  })) : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Répartition des dépenses par catégorie</CardTitle>
        <CardDescription>Analyse de la répartition des dépenses par catégorie sur une période donnée.</CardDescription>
        <DateRangePicker
          onChange={setSelectedDates}
          value={selectedDates}
        />
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip formatter={(value) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(Number(value))} />
            <Legend />
            <Bar dataKey="total_amount" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
