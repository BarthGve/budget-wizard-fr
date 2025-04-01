import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface UserSegmentationProps {
  period: string;
  startDate: string;
  endDate: string;
}

interface SegmentationData {
  segment: string;
  count: number;
}

export default function UserSegmentation({ period, startDate, endDate }: UserSegmentationProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["user-segmentation", period, startDate, endDate],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_user_segmentation", {
        period,
        start_date: startDate,
        end_date: endDate,
      });

      if (error) throw error;
      // Conversion sécurisée avec as
      return data as SegmentationData[];
    },
  });

  if (isLoading) return <Card>Chargement...</Card>;
  if (error) return <Card>Erreur: {error.message}</Card>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Segmentation des utilisateurs</CardTitle>
        <CardDescription>Répartition des utilisateurs par segment</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="segment" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
