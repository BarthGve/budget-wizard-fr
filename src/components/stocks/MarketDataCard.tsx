
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface MarketDataCardProps {
  symbol: string;
  data: {
    c: number;
    pc: number;
  };
}

export const MarketDataCard = ({ symbol, data }: MarketDataCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

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
    <Card>
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
};
