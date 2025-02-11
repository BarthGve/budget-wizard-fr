
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { toast } from "sonner";

const StocksPage = () => {
  const [investmentAmount, setInvestmentAmount] = useState("");

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

  const handleInvestmentSubmit = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      const amount = parseFloat(investmentAmount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error("Montant invalide");
      }

      const { error } = await supabase
        .from("stock_investments")
        .insert({
          profile_id: user.id,
          amount,
          investment_date: new Date().toISOString(),
        });

      if (error) throw error;

      toast.success("Investissement enregistré avec succès");
      setInvestmentAmount("");
      refetchHistory();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

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
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bourse</h1>
          <p className="text-muted-foreground">
            Suivez vos investissements et les marchés en temps réel
          </p>
        </div>

        {/* Market Data Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {marketData?.map(({ symbol, data }: any) => {
            // Déterminer le nom à afficher en fonction du symbole
            let displayName = "";
            if (symbol === '^FCHI') {
              displayName = 'CAC 40';
            } else if (symbol === 'IWDA.AS') {
              displayName = 'MSCI World ETF';
            } else if (symbol === 'BTC-EUR') {
              displayName = 'Bitcoin/EUR';
            }

            return (
              <Card key={symbol}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {displayName}
                  </CardTitle>
                  {data.c > data.pc ? (
                    <ArrowUpRight className="h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-500" />
                  )}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatPrice(data.c)}</div>
                  <p className={`text-xs ${data.c > data.pc ? 'text-green-500' : 'text-red-500'}`}>
                    {((data.c - data.pc) / data.pc * 100).toFixed(2)}%
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Investment Input and Current Year Total */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Nouvel Investissement</CardTitle>
              <CardDescription>Enregistrez votre investissement mensuel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  type="number"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                  placeholder="Montant investi"
                />
                <Button onClick={handleInvestmentSubmit}>
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Enregistrer
                </Button>
              </div>
            </CardContent>
          </Card>

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
        </div>

        {/* Investment History Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Historique des Investissements</CardTitle>
            <CardDescription>Évolution sur les 5 dernières années</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={yearlyData.slice(-5)}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis 
                    tickFormatter={(value) => 
                      new Intl.NumberFormat('fr-FR', {
                        style: 'currency',
                        currency: 'EUR',
                        maximumFractionDigits: 0
                      }).format(value)
                    }
                  />
                  <Tooltip 
                    formatter={(value) => 
                      new Intl.NumberFormat('fr-FR', {
                        style: 'currency',
                        currency: 'EUR',
                        minimumFractionDigits: 2
                      }).format(value as number)
                    }
                  />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#8B5CF6"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StocksPage;
