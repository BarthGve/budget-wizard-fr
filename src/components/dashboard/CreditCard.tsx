
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard as CreditCardIcon } from 'lucide-react';
import { useNavigate } from "react-router-dom";

interface CreditCardProps {
  totalMensualites: number;
  totalRevenue: number;
  className?: string;
}

export const CreditCard = ({
  totalMensualites,
  totalRevenue,
  className
}: CreditCardProps) => {
  const navigate = useNavigate();
  const tauxEndettement = totalRevenue > 0 ? (totalMensualites / totalRevenue) * 100 : 0;
  
  const getBadgeVariant = (taux: number) => {
    if (taux < 30) return "default";
    if (taux < 40) return "secondary";
    return "destructive";
  };

  return (
    <Card 
      className={className}
      onClick={() => navigate("/credits")}
    >
      <CardHeader className="py-[16px]">
        <div className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl">Crédits</CardTitle>
          <CreditCardIcon className="h-6 w-6 text-muted-foreground" />
        </div>
        <CardDescription>Mensualités et taux d'endettement</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div>
            <p className="text-xl font-bold">{Math.round(totalMensualites)} €</p>
          </div>
          <div className="relative">
            <Badge variant={getBadgeVariant(tauxEndettement)} className="px-3 py-1">
              {Math.round(tauxEndettement)}%
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
