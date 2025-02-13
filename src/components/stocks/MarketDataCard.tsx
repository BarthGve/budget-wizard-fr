
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {displayName}
        </CardTitle>
        {isPositive ? (
          <ArrowUpRight className="h-4 w-4 text-green-500" />
        ) : (
          <ArrowDownRight className="h-4 w-4 text-red-500" />
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-2xl font-bold">
            {formatPrice(data.c, isCAC)}
            {isCAC && " pts"}
          </div>
          <p className={`text-xs ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {((data.c - data.pc) / data.pc * 100).toFixed(2)}%
          </p>
          
          {/* Sparkline Chart */}
          <div className="h-[60px] -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history}>
                <defs>
                  <linearGradient id={`gradient-${symbol}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={0.2} />
                    <stop offset="100%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={color}
                  strokeWidth={1.5}
                  fillOpacity={1}
                  fill={`url(#gradient-${symbol})`}
                  dot={false}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
