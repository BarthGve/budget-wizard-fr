
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Line, LineChart, ResponsiveContainer } from "recharts";

interface MarketDataCardProps {
  symbol: string;
  data: {
    c: number;
    pc: number;
  };
  history: Array<{
    date: string;
    value: number;
  }>;
}

export const MarketDataCard = ({ symbol, data, history }: MarketDataCardProps) => {
  console.log(`Rendering MarketDataCard for ${symbol}`, { data, history });

  const formatPrice = (price: number, isCAC: boolean) => {
    if (isCAC) {
      return new Intl.NumberFormat('fr-FR', {
        maximumFractionDigits: 2,
      }).format(price);
    }
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  let displayName = "";
  let isCAC = false;
  if (symbol === 'I:FCHI') {
    displayName = 'CAC 40';
    isCAC = true;
  } else if (symbol === 'AAPL') {
    displayName = 'Apple';
  } else if (symbol === 'BTC-EUR') {
    displayName = 'Bitcoin/EUR';
  }

  const isPositive = data.c > data.pc;
  const color = isPositive ? '#22c55e' : '#ef4444';

  // Vérifions que nous avons bien des données historiques
  if (!history || history.length === 0) {
    console.warn(`No historical data for ${symbol}`);
  }

  return (
    <Card className="p-4">
      <CardHeader className="px-0 pb-2">
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
              {isPositive ? (
                <ArrowUpRight className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDownRight className="h-4 w-4 mr-1" />
              )}
              {((data.c - data.pc) / data.pc * 100).toFixed(2)}%
            </div>
          </div>
          
          {/* Sparkline Chart */}
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
        </div>
      </CardContent>
    </Card>
  );
};
