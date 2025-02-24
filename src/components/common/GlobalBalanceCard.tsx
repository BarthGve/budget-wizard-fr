
import { Card, CardContent } from "@/components/ui/card";
import { Scale } from 'lucide-react';
import { cn } from "@/lib/utils";

interface GlobalBalanceCardProps {
  balance: number;
  className?: string;
}

export const GlobalBalanceCard = ({
  balance,
  className
}: GlobalBalanceCardProps) => {
  return(
    <Card className={cn("bg-background/40 hover:bg-background/60 backdrop-blur-sm transition-all w-fit", className)}>
      <CardContent className="p-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-muted-foreground" />
            <span className="text-lg font-medium">Solde global</span>
          </div>
          <p className={cn("text-lg font-bold", balance >= 0 ? "text-green-600" : "text-red-600")}>
            {balance.toLocaleString('fr-FR')} €
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
