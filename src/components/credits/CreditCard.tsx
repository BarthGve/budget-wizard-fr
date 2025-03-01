
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard as CreditCardIcon } from 'lucide-react';
import { Link } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

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
 
  const currentMonthName = new Date().toLocaleString('fr-FR', { month: 'long' });

  return (
    <Card 
      className="bg-background cursor-pointer hover:shadow-md transition-shadow"
    >
      <Link to="/credits" className="block">
        <CardHeader className="py-[16px]">
          <div className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl">Crédits</CardTitle>
            <CreditCardIcon className="h-6 w-6 text-muted-foreground" />
          </div>
          <CardDescription>Total dû en {currentMonthName}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <p className="text-xl font-bold leading-none">{Math.round(totalMensualites)} €</p>
              </div>
              <Tooltip>
                <TooltipTrigger>
                  <Badge variant={getBadgeVariant(tauxEndettement)} className="px-3 py-1">
                    {Math.round(tauxEndettement)}%
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Taux d'endettement</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};
