
import React, { useState } from 'react';
import { DateRangePicker } from "@/components/admin/financial/DateRangePicker";
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from 'date-fns';
import { FinancialOverview } from '@/components/admin/financial/FinancialOverview';
import ExpenseDistribution from '@/components/admin/financial/ExpenseDistribution';
import TrendAnalysis from '@/components/admin/financial/TrendAnalysis';
import UserSegmentation from '@/components/admin/financial/UserSegmentation';
import { FinancialStats as FinancialStatsType } from '@/types/supabase-rpc';

export default function FinancialStats() {
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({
    from: new Date(new Date().getFullYear(), 0, 1),
    to: new Date(),
  });
  const [selectedPeriod, setSelectedPeriod] = useState<"monthly" | "quarterly" | "yearly">("monthly");

  const startDate = dateRange.from ? format(dateRange.from, 'yyyy-MM-dd') : null;
  const endDate = dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : null;

  const { data: statsData, isLoading, error } = useQuery({
    queryKey: ["financial-stats", selectedPeriod, startDate, endDate],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_financial_stats", {
        period: selectedPeriod,
        start_date: startDate,
        end_date: endDate,
      });

      if (error) throw error;
      // Conversion sécurisée avec as
      return data as FinancialStatsType;
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Statistiques Financières</h1>
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-10 w-[200px] justify-start text-left font-normal">
                <Calendar className="mr-2 h-4 w-4" />
                <span>Période</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ml-auto h-4 w-4 text-muted-foreground"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[200px]">
              <DropdownMenuItem onClick={() => setSelectedPeriod("monthly")}>Mensuel</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedPeriod("quarterly")}>Trimestriel</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedPeriod("yearly")}>Annuel</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DateRangePicker
            value={dateRange}
            onChange={setDateRange}
          />
        </div>
      </div>

      {isLoading ? (
        <div>Chargement des statistiques...</div>
      ) : error ? (
        <div>Erreur lors du chargement des statistiques.</div>
      ) : statsData ? (
        <>
          <FinancialOverview stats={statsData} />
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            <ExpenseDistribution period={selectedPeriod} startDate={startDate || ""} endDate={endDate || ""} />
            <TrendAnalysis period={selectedPeriod} startDate={startDate || ""} endDate={endDate || ""} />
          </div>
          <UserSegmentation period={selectedPeriod} startDate={startDate || ""} endDate={endDate || ""} />
        </>
      ) : (
        <div>Aucune donnée disponible pour la période sélectionnée.</div>
      )}
    </div>
  );
}
