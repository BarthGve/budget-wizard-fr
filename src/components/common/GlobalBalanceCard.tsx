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
  <div className="flex justify-end w-full">
  <Card className={cn("bg-background/60 backdrop-blur-sm transition-all hover:bg-background/80", className)}>
      <CardContent className="p-4 mx-0 ">
        <div className="flex items-center justify-between">
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
    </div>
  )
};