
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
import { motion } from "framer-motion";

const StocksPage = () => {
  const [currentYearDialogOpen, setCurrentYearDialogOpen] = useState(false);
  const [yearlyTotalDialogOpen, setYearlyTotalDialogOpen] = useState(false);

  // Fetch market data
  const {
    data: marketData,
    isLoading: isMarketDataLoading
  } = useQuery({
    queryKey: ["marketData"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.functions.invoke("get-market-data");
      if (error) throw error;
      console.log("Market data received:", data);
      return data;
    },
    refetchInterval: 60000 // Refresh every minute
  });

  // Fetch investment history
  const {
    data: investmentHistory,
    refetch: refetchHistory
  } = useQuery({
    queryKey: ["investmentHistory"],
    queryFn: async () => {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");
      const {
        data,
        error
      } = await supabase.from("stock_investments").select("*").eq("profile_id", user.id).order("investment_date", {
        ascending: true
      });
      if (error) throw error;
      return data;
    }
  });

  // Calculate yearly totals for the chart
  const yearlyData = investmentHistory?.reduce((acc: any[], investment) => {
    const year = new Date(investment.investment_date).getFullYear();
    const existingYear = acc.find(item => item.year === year);
    if (existingYear) {
      existingYear.amount += Number(investment.amount);
    } else {
      acc.push({
        year,
        amount: Number(investment.amount)
      });
    }
    return acc;
  }, []) || [];

  // Calculate current year total
  const currentYear = new Date().getFullYear();
  const currentYearTotal = yearlyData.find(data => data.year === currentYear)?.amount || 0;
  const currentYearInvestments = investmentHistory?.filter(inv => new Date(inv.investment_date).getFullYear() === currentYear) || [];

  // Calculate total investment
  const totalInvestment = yearlyData.reduce((sum, data) => sum + data.amount, 0);
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  // Préparer les données des cartes avec un placeholder si les données ne sont pas encore chargées
  const marketCards = isMarketDataLoading
    ? [
        { symbol: '^FCHI', data: null, history: null },
        { symbol: 'AAPL', data: null, history: null },
        { symbol: 'BTC-EUR', data: null, history: null }
      ]
    : marketData || [];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <DashboardLayout>
      <motion.div 
        className="space-y-6"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div className="flex justify-between items-center" variants={itemVariants}>
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-fade-in">Bourse</h1>
            <p className="text-muted-foreground">
              Suivez vos investissements et les marchés en temps réel
            </p>
          </div>
        </motion.div>

        {/* Market Data Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={containerVariants}
        >
          {marketCards.map(({
            symbol,
            data,
            history
          }, index) => (
            <motion.div 
              key={symbol}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.03, 
                rotateY: 5,
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)"
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ delay: index * 0.05 }}
            >
              <MarketDataCard 
                symbol={symbol} 
                data={data} 
                history={history} 
                isLoading={isMarketDataLoading}
              />
            </motion.div>
          ))}
        </motion.div>

        <motion.div className="flex justify-between items-center" variants={itemVariants}>
          <div>
            <h2 className="font-bold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-fade-in text-2xl">Compte titre</h2>
            <p className="text-muted-foreground">
              Renseigner les sommes investies dans votre portefeuille
            </p>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <InvestmentDialog onSuccess={refetchHistory} />
          </motion.div>
        </motion.div>    
   
        {/* Grid Container */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={containerVariants}
        >
          {/* Colonne de gauche (1/3) avec les cards */}
          <motion.div className="space-y-6" variants={containerVariants}>
            <motion.div 
              variants={itemVariants}
              whileHover={{ 
                scale: 1.03, 
                rotateY: 5,
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)"
              }}
              whileTap={{ scale: 0.98 }}
            >
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
            </motion.div>
            <motion.div 
              variants={itemVariants}
              whileHover={{ 
                scale: 1.03, 
                rotateY: 5,
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)"
              }}
              whileTap={{ scale: 0.98 }}
            >
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
            </motion.div>
          </motion.div>
          {/* Colonne de droite (2/3) avec le graphique */}
          <motion.div 
            className="col-span-2"
            variants={itemVariants}
            whileHover={{ 
              scale: 1.01,
              boxShadow: "0 5px 15px rgba(0, 0, 0, 0.05)"
            }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Historique des investissements</CardTitle>
                <CardDescription>Évolution de vos investissements sur les 5 dernières années</CardDescription>
              </CardHeader>
              <CardContent className="h-full">
                <div className="h-full">
                  <InvestmentHistory data={yearlyData} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Modals */}
        <CurrentYearInvestmentsDialog open={currentYearDialogOpen} onOpenChange={setCurrentYearDialogOpen} investments={currentYearInvestments} onSuccess={refetchHistory} />

        <YearlyInvestmentsDialog open={yearlyTotalDialogOpen} onOpenChange={setYearlyTotalDialogOpen} yearlyData={yearlyData} />
      </motion.div>
    </DashboardLayout>
  );
};

export default StocksPage;
