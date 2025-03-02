
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { motion } from "framer-motion";
import { StocksHeader } from "@/components/stocks/StocksHeader";
import { MarketDataSection } from "@/components/stocks/MarketDataSection";
import { InvestmentsSummary } from "@/components/stocks/InvestmentsSummary";

// Process investment data to calculate yearly totals, current year total, etc.
const processInvestmentData = (investmentHistory: any[] | undefined) => {
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
  const currentYearInvestments = investmentHistory?.filter(inv => 
    new Date(inv.investment_date).getFullYear() === currentYear) || [];

  // Calculate total investment
  const totalInvestment = yearlyData.reduce((sum, data) => sum + data.amount, 0);

  return {
    yearlyData,
    currentYearTotal,
    currentYearInvestments,
    totalInvestment
  };
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price);
};

const StocksPage = () => {
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

  // Process the investment data
  const { 
    yearlyData, 
    currentYearTotal, 
    currentYearInvestments, 
    totalInvestment 
  } = processInvestmentData(investmentHistory);

  // Prepare market cards data
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

  return (
    <DashboardLayout>
      <motion.div 
        className="space-y-6"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <StocksHeader onSuccess={refetchHistory} />
        
        <MarketDataSection 
          marketCards={marketCards} 
          isLoading={isMarketDataLoading} 
        />
        
        <InvestmentsSummary 
          yearlyData={yearlyData}
          currentYearTotal={currentYearTotal}
          totalInvestment={totalInvestment}
          currentYearInvestments={currentYearInvestments}
          onSuccess={refetchHistory}
          formatPrice={formatPrice}
        />
      </motion.div>
    </DashboardLayout>
  );
};

export default StocksPage;
