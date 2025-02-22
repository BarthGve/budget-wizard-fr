
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard as CreditCardIcon } from 'lucide-react';
import { useNavigate } from "react-router-dom";

interface CreditCardProps {
  totalMensualites: number;
  totalRevenue: number;
}

export const CreditCard = ({
  totalMensualites,
  totalRevenue
}: CreditCardProps) => {
  const navigate = useNavigate();
  const tauxEndettement = totalRevenue > 0 ? (totalMensualites / totalRevenue) * 100 : 0;
  
  const getBadgeVariant = (taux: number) => {
    if (taux < 30) return "default";
    if (taux < 40) return "secondary";
    return "destructive";
  };

  // Requête pour obtenir les crédits actifs et remboursés du mois en cours
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  return (
    <Card 
      className="bg-background cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => navigate("/credits")}
    >
      <CardHeader className="py-[16px]">
        <div className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl">Crédits</CardTitle>
          <CreditCardIcon className="h-6 w-6 text-muted-foreground" />
        </div>
        <CardDescription>Vue d'ensemble des crédits</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
        <div className="flex items-center justify-between">
  <div className="flex flex-col">
    <p className="text-xl font-bold leading-none">{Math.round(totalMensualites)} €</p>
    <p className="text-sm text-muted-foreground mt-1">Mensualités totales</p>
  </div>
  <Badge variant={getBadgeVariant(tauxEndettement)} className="px-3 py-1">
    {Math.round(tauxEndettement)}%
  </Badge>
</div>
      </CardContent>
    </Card>
  );
};
