
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Line, LineChart, ResponsiveContainer } from "recharts";
import CardLoader from "@/components/ui/cardloader";

interface MarketDataCardProps {
  symbol: string;
  data: {
    c: number;
    pc: number;
  } | null;
  history: Array<{
    date: string;
    value: number;
  }> | null;
  isLoading?: boolean;
}

export const MarketDataCard = ({
  symbol,
  data,
  history,
  isLoading = false
}: MarketDataCardProps) => {
  console.log(`Rendering MarketDataCard for ${symbol}`, {
    data,
    history,
    isLoading
  });
  
  const formatPrice = (price: number, isCAC: boolean) => {
    if (isCAC) {
      return new Intl.NumberFormat('fr-FR', {
        maximumFractionDigits: 2
      }).format(price);
    }
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };
  
  let displayName = "";
  let isCAC = false;
  if (symbol === '^FCHI') {
    displayName = 'CAC 40';
    isCAC = true;
  } else if (symbol === 'AAPL') {
    displayName = 'Apple';
  } else if (symbol === 'BTC-EUR') {
    displayName = 'Bitcoin/EUR';
  }
  
  // Si on est en chargement ou si on n'a pas de données, on affiche le loader
  if (isLoading || !data) {
    return (
      <Card className="p-4 px-[13px]px-0 pb-2 my-0 py-px px-[14px]">
        <CardHeader className="mx-0 px-0 py-[12px]">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {displayName}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <CardLoader />
        </CardContent>
      </Card>
    );
  }
  
  const isPositive = data.c > data.pc;
  const color = isPositive ? '#22c55e' : '#ef4444';

  // Vérifions que nous avons bien des données historiques
  if (!history || history.length === 0) {
    console.warn(`No historical data for ${symbol}`);
  }
  
  return (
    <Card className="p-4 px-[13px]px-0 pb-2 my-0 py-px px-[14px]">
      <CardHeader className="mx-0 px-0 py-[12px]">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {displayName}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">
              {formatPrice(data.c, isCAC)}
              {isCAC && " pts"}
            </div>
            <div className={`flex items-center text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {isPositive ? <ArrowUpRight className="h-4 w-4 mr-1" /> : <ArrowDownRight className="h-4 w-4 mr-1" />}
              {((data.c - data.pc) / data.pc * 100).toFixed(2)}%
            </div>
          </div>
          
          {/* Sparkline Chart */}
          {history && history.length > 0 && (
            <div className="h-[80px] mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history}>
                  <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
