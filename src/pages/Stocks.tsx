
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MarketDataCard } from "@/components/stocks/MarketDataCard";
import { InvestmentDialog } from "@/components/stocks/InvestmentDialog";
import { InvestmentHistory } from "@/components/stocks/InvestmentHistory";
import { CurrentYearInvestmentsDialog } from "@/components/stocks/CurrentYearInvestmentsDialog";
import { YearlyInvestmentsDialog } from "@/components/stocks/YearlyInvestmentsDialog";
import { useState } from "react";

const StocksPage = () => {
  const [currentYearDialogOpen, setCurrentYearDialogOpen] = useState(false);
  const [yearlyTotalDialogOpen, setYearlyTotalDialogOpen] = useState(false);

  // Fetch market data
  const { data: marketData } = useQuery({
    queryKey: ["marketData"],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("get-market-data");
      if (error) throw error;
      console.log("Market data received:", data);
      return data;
    },
    refetchInterval: 60000, // Refresh every minute
  });

  // Fetch investment history
  const { data: investmentHistory, refetch: refetchHistory } = useQuery({
    queryKey: ["investmentHistory"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      const { data, error } = await supabase
        .from("stock_investments")
        .select("*")
        .eq("profile_id", user.id)
        .order("investment_date", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  // Calculate yearly totals for the chart
  const yearlyData = investmentHistory?.reduce((acc: any[], investment) => {
    const year = new Date(investment.investment_date).getFullYear();
    const existingYear = acc.find(item => item.year === year);
    
    if (existingYear) {
      existingYear.amount += Number(investment.amount);
    } else {
      acc.push({ year, amount: Number(investment.amount) });
    }
    
    return acc;
  }, []) || [];

  // Calculate current year total
  const currentYear = new Date().getFullYear();
  const currentYearTotal = yearlyData.find(data => data.year === currentYear)?.amount || 0;
  const currentYearInvestments = investmentHistory?.filter(
    inv => new Date(inv.investment_date).getFullYear() === currentYear
  ) || [];

  // Calculate total investment
  const totalInvestment = yearlyData.reduce((sum, data) => sum + data.amount, 0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-fade-in">Bourse</h1>
            <p className="text-muted-foreground">
              Suivez vos investissements et les marchés en temps réel
            </p>
          </div>
          <InvestmentDialog onSuccess={refetchHistory} />
        </div>

        {/* Market Data Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {marketData?.map(({ symbol, data, history }) => (
            <MarketDataCard 
              key={symbol} 
              symbol={symbol} 
              data={data} 
              history={history} 
            />
          ))}
        </div>

      
   
{/* Grid Container */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {/* Colonne de gauche (1/3) avec les cards */}
  <div className="space-y-6">
    <Card className="cursor-pointer transition-colors hover:bg-accent/50" onClick={() => setCurrentYearDialogOpen(true)}>
      <CardHeader>
        <CardTitle>Total {currentYear}</CardTitle>
        <CardDescription>Montant total investi cette année</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {formatPrice(currentYearTotal)}
        </div>
      </CardContent>
    </Card>
    <Card className="cursor-pointer transition-colors hover:bg-accent/50" onClick={() => setYearlyTotalDialogOpen(true)}>
      <CardHeader>
        <CardTitle>Total global</CardTitle>
        <CardDescription>Montant total de tous les investissements</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {formatPrice(totalInvestment)}
        </div>
      </CardContent>
    </Card>
  </div>
  {/* Colonne de droite (2/3) avec le graphique */}
  <div className="col-span-2">
    <Card>
      <CardHeader>
        <CardTitle>Historique des investissements</CardTitle>
        <CardDescription>Évolution de vos investissements sur les 5 dernières années</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <div className="h-full">
          <InvestmentHistory data={yearlyData} />
        </div>
      </CardContent>
    </Card>
  </div>
</div>

        {/* Modals */}
        <CurrentYearInvestmentsDialog
          open={currentYearDialogOpen}
          onOpenChange={setCurrentYearDialogOpen}
          investments={currentYearInvestments}
          onSuccess={refetchHistory}
        />

        <YearlyInvestmentsDialog
          open={yearlyTotalDialogOpen}
          onOpenChange={setYearlyTotalDialogOpen}
          yearlyData={yearlyData}
        />
      </div>
    </DashboardLayout>
  );
};

export default StocksPage;
