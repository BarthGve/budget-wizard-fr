
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard as CreditCardIcon } from 'lucide-react';

interface CreditCardProps {
  totalMensualites: number;
  totalRevenue: number;
}

export const CreditCard = ({
  totalMensualites,
  totalRevenue
}: CreditCardProps) => {
  const tauxEndettement = totalRevenue > 0 ? (totalMensualites / totalRevenue) * 100 : 0;
  
  const getBadgeVariant = (taux: number) => {
    if (taux < 30) return "default";
    if (taux < 40) return "secondary";
    return "destructive";
  };

  const getBadgeText = (taux: number) => {
    if (taux < 30) return "faible";
    if (taux < 40) return "modéré";
    return "élevé";
  };

  return (
    <Card className="bg-background">
      <CardHeader className="py-[16px]">
        <div className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl">Crédits</CardTitle>
          <CreditCardIcon className="h-6 w-6 text-muted-foreground" />
        </div>
        <CardDescription>Mensualités et taux d'endettement</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-xl font-bold">{Math.round(totalMensualites)} €</p>
          <p className="text-sm text-muted-foreground">Mensualités</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={getBadgeVariant(tauxEndettement)}>
            {Math.round(tauxEndettement)}%
          </Badge>
          <span className="text-sm text-muted-foreground">
            {getBadgeText(tauxEndettement)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
