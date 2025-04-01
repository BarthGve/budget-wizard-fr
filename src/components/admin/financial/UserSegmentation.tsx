
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import StyledLoader from '@/components/ui/StyledLoader';
import { formatCurrency } from '@/utils/format';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SegmentationData } from '@/types/supabase-rpc';

interface UserSegmentationProps {
  period: string;
  dateRange: { start?: Date; end?: Date };
}

export const UserSegmentation = ({ period, dateRange }: UserSegmentationProps) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['user-segmentation', period, dateRange],
    queryFn: async () => {
      // Construire la plage de dates pour la requête
      let params: any = { period };
      
      if (dateRange.start) {
        params.start_date = dateRange.start.toISOString().split('T')[0];
      }
      
      if (dateRange.end) {
        params.end_date = dateRange.end.toISOString().split('T')[0];
      }
      
      const { data, error } = await supabase.rpc('get_user_segmentation', params);
      
      if (error) throw error;
      
      // Si data est null ou undefined, renvoyer des données par défaut
      if (!data) {
        return {
          profileData: [],
          incomeDistribution: [],
          userTableData: []
        } as SegmentationData;
      }
      
      return data as SegmentationData;
    },
    refetchOnWindowFocus: false
  });
  
  // Couleurs pour les graphiques
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A67ADB'];
  
  if (isLoading) {
    return <StyledLoader />;
  }
  
  if (error) {
    return (
      <Card className="col-span-full">
        <CardContent className="pt-6">
          <p className="text-red-500">Erreur lors du chargement des données de segmentation</p>
        </CardContent>
      </Card>
    );
  }
  
  // Données par défaut si pas de données
  const profileData = data?.profileData || [
    { name: "basic", value: 75 },
    { name: "pro", value: 25 }
  ];
  
  const incomeDistribution = data?.incomeDistribution || [
    { range: "< 1000€", count: 10 },
    { range: "1000-2000€", count: 25 },
    { range: "2000-3000€", count: 30 },
    { range: "3000-4000€", count: 20 },
    { range: "4000-5000€", count: 10 },
    { range: "> 5000€", count: 5 }
  ];
  
  const userTableData = data?.userTableData || [];

  return (
    <div className="space-y-8">
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        {/* Graphique Distribution des profils utilisateurs */}
        <Card>
          <CardHeader>
            <CardTitle>Types d'utilisateurs</CardTitle>
            <CardDescription>Distribution par type de profil</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={profileData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {profileData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip formatter={(value) => [`${value} utilisateurs`, 'Nombre']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Graphique Distribution des revenus */}
        <Card>
          <CardHeader>
            <CardTitle>Distribution des revenus</CardTitle>
            <CardDescription>Revenus mensuels des utilisateurs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={incomeDistribution}
                  margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="range" angle={-45} textAnchor="end" height={60} />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} utilisateurs`, 'Nombre']} />
                  <Bar dataKey="count" name="Utilisateurs" fill="#8884d8">
                    {incomeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Tableau des données utilisateurs */}
      <Card>
        <CardHeader>
          <CardTitle>Échantillon utilisateurs</CardTitle>
          <CardDescription>Aperçu des comportements financiers</CardDescription>
        </CardHeader>
        <CardContent>
          {userTableData.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Épargne</TableHead>
                    <TableHead>Dépenses</TableHead>
                    <TableHead>Crédits actifs</TableHead>
                    <TableHead>Investisseur</TableHead>
                    <TableHead>Propriétés</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userTableData.map((user, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{user.type}</TableCell>
                      <TableCell>{formatCurrency(user.epargne)}</TableCell>
                      <TableCell>{formatCurrency(user.depenses)}</TableCell>
                      <TableCell>{user.credits}</TableCell>
                      <TableCell>{user.investissements}</TableCell>
                      <TableCell>{user.properties}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">Aucune donnée disponible</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
