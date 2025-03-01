
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Banknote, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useEffect, useState } from "react";
import { Line, LineChart, ResponsiveContainer } from "recharts";
import CardLoader from "@/components/ui/cardloader";

interface ContributorShare {
  name: string;
  start: number;
  end: number;
  amount: number;
}

interface RevenueCardProps {
  totalRevenue: number;
  contributorShares: ContributorShare[];
  previousRevenue?: number;
  history?: Array<{ date: string; value: number }>;
  isLoading?: boolean;
}

export const RevenueCard = ({
  totalRevenue,
  contributorShares,
  previousRevenue = 0,
  history = [],
  isLoading = false
}: RevenueCardProps) => {
  const [displayedRevenue, setDisplayedRevenue] = useState(totalRevenue);
  
  // Use effect to animate the total when it changes
  useEffect(() => {
    setDisplayedRevenue(totalRevenue);
  }, [totalRevenue]);

  // Si on est en chargement, afficher le loader
  if (isLoading) {
    return (
      <Card className="bg-background hover:shadow-md transition-all duration-300">
        <CardHeader className="py-[16px]">
          <div className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl">Revenus globaux</CardTitle>
            <Banknote className="h-6 w-6 text-muted-foreground" />
          </div>
          <CardDescription>Somme de l'ensemble des revenus</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <CardLoader />
        </CardContent>
      </Card>
    );
  }
  
  const isPositive = previousRevenue > 0 && totalRevenue >= previousRevenue;
  const percentChange = previousRevenue > 0 
    ? ((totalRevenue - previousRevenue) / previousRevenue * 100) 
    : 0;
  const color = isPositive ? '#22c55e' : '#ef4444';

  return (
    <Card className="bg-background hover:shadow-md transition-all duration-300">
      <CardHeader className="py-[16px]">
        <div className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl">Revenus globaux</CardTitle>
            <Banknote className="h-6 w-6 text-muted-foreground" />
        </div>
        <CardDescription>Somme de l'ensemble des revenus</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="font-bold text-xl">{Math.round(displayedRevenue)} €</p>
          
          {previousRevenue > 0 && (
            <div className={`flex items-center text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {isPositive ? <ArrowUpRight className="h-4 w-4 mr-1" /> : <ArrowDownRight className="h-4 w-4 mr-1" />}
              {percentChange.toFixed(2)}%
            </div>
          )}
        </div>
        
        {/* Ajout d'un graphique comme dans MarketDataCard */}
        {history && history.length > 0 && (
          <div className="h-[80px] mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke={color} 
                  strokeWidth={2} 
                  dot={false} 
                  isAnimationActive={false} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
