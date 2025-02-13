
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MarketDataCard } from "@/components/stocks/MarketDataCard";
import { InvestmentDialog } from "@/components/stocks/InvestmentDialog";
import { InvestmentHistory } from "@/components/stocks/InvestmentHistory";

const StocksPage = () => {
  // Fetch market data
  const { data: marketData } = useQuery({
    queryKey: ["marketData"],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("get-market-data");
      if (error) throw error;
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
            <h1 className="text-3xl font-bold tracking-tight">Bourse</h1>
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

        {/* Investment Totals */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
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

          <Card>
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

        {/* Investment History Chart */}
        <InvestmentHistory data={yearlyData} />
      </div>
    </DashboardLayout>
  );
};

export default StocksPage;
