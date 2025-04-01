
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/admin/financial/DateRangePicker";
import { FinancialOverview } from "@/components/admin/financial/FinancialOverview";
import { ExpenseDistribution } from "@/components/admin/financial/ExpenseDistribution";
import { UserSegmentation } from "@/components/admin/financial/UserSegmentation";
import { TrendAnalysis } from "@/components/admin/financial/TrendAnalysis";
import { Download } from "lucide-react";
import StyledLoader from "@/components/ui/StyledLoader";
import { toast } from "sonner";
import { FinancialStats as FinancialStatsType } from '@/types/supabase-rpc';

// Types des périodes disponibles
type TimePeriod = "all" | "year" | "quarter" | "month";

const FinancialStats = () => {
  const [dateRange, setDateRange] = useState<{start?: Date; end?: Date}>({});
  const [activePeriod, setActivePeriod] = useState<TimePeriod>("month");
  
  // Requête pour récupérer les données globales
  const { data: globalStats, isLoading } = useQuery({
    queryKey: ["admin-financial-stats", activePeriod, dateRange],
    queryFn: async () => {
      // Vérifier si l'utilisateur est admin
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");
      
      const { data: isAdmin, error: adminCheckError } = await supabase.rpc('has_role', {
        user_id: user.id,
        role: 'admin'
      });
      
      if (adminCheckError || !isAdmin) {
        throw new Error("Accès non autorisé");
      }
      
      // Construire la plage de dates pour la requête
      let params: any = { period: activePeriod };
      
      if (dateRange.start) {
        params.start_date = dateRange.start.toISOString().split('T')[0];
      }
      
      if (dateRange.end) {
        params.end_date = dateRange.end.toISOString().split('T')[0];
      }
      
      // Récupérer les statistiques financières
      const { data, error } = await supabase.rpc('get_financial_stats', params);
      
      if (error) throw error;
      
      // Assurer que les données ont le bon format
      const result: FinancialStatsType = data || {
        total_expenses: 0,
        total_savings: 0,
        total_investments: 0,
        active_credits: 0,
        avg_monthly_expense: 0,
        avg_savings_rate: 0,
        expense_distribution: []
      };
      
      return result;
    },
    refetchOnWindowFocus: false
  });
  
  // Export des données au format CSV
  const exportToCSV = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");
      
      // Appel à la fonction RPC pour obtenir les données exportables
      const { data, error } = await supabase.rpc('export_financial_stats', {
        period: activePeriod,
        start_date: dateRange.start?.toISOString().split('T')[0],
        end_date: dateRange.end?.toISOString().split('T')[0]
      });
      
      if (error) throw error;
      
      // Conversion en CSV
      const exportData = data as any[];
      if (exportData && Array.isArray(exportData) && exportData.length > 0) {
        const headers = Object.keys(exportData[0]).join(',');
        const rows = exportData.map(row => Object.values(row).join(','));
        const csv = [headers, ...rows].join('\n');
        
        // Création du fichier à télécharger
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `statistiques-financieres-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        toast.success("Export réussi");
      } else {
        toast.warning("Aucune donnée à exporter");
      }
    } catch (error: any) {
      toast.error(`Erreur lors de l'export: ${error.message}`);
    }
  };
  
  const handlePeriodChange = (period: string) => {
    setActivePeriod(period as TimePeriod);
  };
  
  if (isLoading) {
    return <StyledLoader />;
  }
  
  return (
    <DashboardLayout>
      <div className="min-h-screen py-6">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Statistiques Financières</h1>
            <p className="text-lg text-muted-foreground">
              Analyse détaillée des données financières des utilisateurs
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0">
            <DateRangePicker 
              onChange={setDateRange} 
              value={dateRange}
            />
            <Button 
              onClick={exportToCSV}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download size={16} />
              Exporter
            </Button>
          </div>
        </div>
        
        <Tabs 
          defaultValue="overview"
          className="w-full"
        >
          <TabsList className="mb-6 grid grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="trends">Tendances</TabsTrigger>
            <TabsTrigger value="users">Segmentation</TabsTrigger>
            <TabsTrigger value="expenses">Dépenses</TabsTrigger>
          </TabsList>
          
          <div className="mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Période d'analyse</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant={activePeriod === "month" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => handlePeriodChange("month")}
                  >
                    Mois en cours
                  </Button>
                  <Button 
                    variant={activePeriod === "quarter" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => handlePeriodChange("quarter")}
                  >
                    Trimestre
                  </Button>
                  <Button 
                    variant={activePeriod === "year" ? "default" : "outline"}
                    size="sm" 
                    onClick={() => handlePeriodChange("year")}
                  >
                    Année
                  </Button>
                  <Button 
                    variant={activePeriod === "all" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => handlePeriodChange("all")}
                  >
                    Toutes les données
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <TabsContent value="overview">
            <FinancialOverview stats={globalStats as FinancialStatsType} />
          </TabsContent>
          
          <TabsContent value="trends">
            <TrendAnalysis period={activePeriod} dateRange={dateRange} />
          </TabsContent>
          
          <TabsContent value="users">
            <UserSegmentation period={activePeriod} dateRange={dateRange} />
          </TabsContent>
          
          <TabsContent value="expenses">
            <ExpenseDistribution period={activePeriod} dateRange={dateRange} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default FinancialStats;
