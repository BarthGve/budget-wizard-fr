
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
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import StyledLoader from '@/components/ui/StyledLoader';
import { formatCurrency } from '@/utils/format';

// Type des propriétés
interface UserSegmentationProps {
  period: string;
  dateRange: { start?: Date; end?: Date };
}

export const UserSegmentation = ({ period, dateRange }: UserSegmentationProps) => {
  // Récupération des données de segmentation utilisateur
  const { data, isLoading, error } = useQuery({
    queryKey: ['user-segmentation', period, dateRange],
    queryFn: async () => {
      const params: any = { period };
      
      if (dateRange.start) {
        params.start_date = dateRange.start.toISOString().split('T')[0];
      }
      
      if (dateRange.end) {
        params.end_date = dateRange.end.toISOString().split('T')[0];
      }
      
      const { data, error } = await supabase.rpc('get_user_segmentation', params);
      
      if (error) throw error;
      
      return data || [];
    },
    refetchOnWindowFocus: false
  });
  
  // Configuration des couleurs pour le graphique
  const chartConfig = {
    basic: { label: "Basic", color: "#3b82f6" }, // Bleu
    pro: { label: "Pro", color: "#22c55e" },    // Vert
  };
  
  // Couleurs pour le pie chart
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
  
  // Données simulées pour le graphique de répartition des profils
  const profileData = [
    { name: 'Basic', value: 65 },
    { name: 'Pro', value: 35 },
  ];
  
  // Données simulées pour la distribution des utilisateurs par montant de revenus
  const incomeDistribution = [
    { range: '< 1000€', count: 5 },
    { range: '1000-2000€', count: 15 },
    { range: '2000-3000€', count: 30 },
    { range: '3000-4000€', count: 25 },
    { range: '4000-5000€', count: 15 },
    { range: '> 5000€', count: 10 },
  ];
  
  // Données simulées pour le tableau des utilisateurs
  const userTableData = [
    { 
      id: 1, 
      type: 'Pro', 
      epargne: 1250, 
      depenses: 2800, 
      credits: 2, 
      investissements: 'Oui',
      properties: 1
    },
    { 
      id: 2, 
      type: 'Basic', 
      epargne: 450, 
      depenses: 1800, 
      credits: 1, 
      investissements: 'Non',
      properties: 0
    },
    { 
      id: 3, 
      type: 'Pro', 
      epargne: 980, 
      depenses: 3200, 
      credits: 3, 
      investissements: 'Oui',
      properties: 2
    },
    { 
      id: 4, 
      type: 'Basic', 
      epargne: 320, 
      depenses: 1650, 
      credits: 0, 
      investissements: 'Non',
      properties: 0
    },
    { 
      id: 5, 
      type: 'Basic', 
      epargne: 520, 
      depenses: 2100, 
      credits: 1, 
      investissements: 'Oui',
      properties: 1
    }
  ];

  return (
    <div className="space-y-8">
      {/* Graphiques de segmentation */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Répartition par type de profil</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={profileData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {profileData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={index === 0 ? chartConfig.basic.color : chartConfig.pro.color} 
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name) => [
                      `${value}%`, name
                    ]} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Distribution par revenus</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={incomeDistribution}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="range" />
                  <YAxis tickFormatter={(value) => `${value}%`} />
                  <Tooltip formatter={(value) => [`${value}%`, "Utilisateurs"]} />
                  <Bar 
                    dataKey="count" 
                    fill={chartConfig.basic.color} 
                    name="Pourcentage d'utilisateurs" 
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
      
      {/* Tableau des utilisateurs */}
      <Card>
        <CardHeader>
          <CardTitle>Échantillon d'utilisateurs</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Épargne mensuelle</TableHead>
                <TableHead className="text-right">Dépenses moy.</TableHead>
                <TableHead className="text-center">Crédits</TableHead>
                <TableHead className="text-center">Investissements</TableHead>
                <TableHead className="text-center">Biens immo.</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userTableData.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.id}</TableCell>
                  <TableCell>
                    <span 
                      className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        user.type === 'Pro' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {user.type}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">{formatCurrency(user.epargne)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(user.depenses)}</TableCell>
                  <TableCell className="text-center">{user.credits}</TableCell>
                  <TableCell className="text-center">{user.investissements}</TableCell>
                  <TableCell className="text-center">{user.properties}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Indicateurs de segmentation */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Engagement utilisateurs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Connexions moyennes/semaine</span>
                  <span className="font-mono text-sm">4.2</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Durée moyenne de session</span>
                  <span className="font-mono text-sm">8m 35s</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Taux de rétention à 30j</span>
                  <span className="font-mono text-sm">87%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Taux de conversion Basic → Pro</span>
                  <span className="font-mono text-sm">12%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Utilisateurs Basic</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Dépense moyenne</span>
                  <span className="font-mono text-sm">{formatCurrency(1850)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Taux d'épargne moyen</span>
                  <span className="font-mono text-sm">8.4%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Nombre moyen de contributeurs</span>
                  <span className="font-mono text-sm">1.4</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Crédits actifs</span>
                  <span className="font-mono text-sm">0.8</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Utilisateurs Pro</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Dépense moyenne</span>
                  <span className="font-mono text-sm">{formatCurrency(2950)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Taux d'épargne moyen</span>
                  <span className="font-mono text-sm">14.2%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Nombre moyen de contributeurs</span>
                  <span className="font-mono text-sm">2.1</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Crédits actifs</span>
                  <span className="font-mono text-sm">1.7</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
