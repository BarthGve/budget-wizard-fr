
import { Card, CardContent } from "@/components/ui/card";
import { BadgeEuro } from 'lucide-react';
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface GlobalBalanceCardProps {
  balance: number;
  className?: string;
}

export const GlobalBalanceCard = ({
  balance,
  className
}: GlobalBalanceCardProps) => {
  const [displayedBalance, setDisplayedBalance] = useState(balance);
  
  // Update the displayed balance when the actual balance changes
  useEffect(() => {
    setDisplayedBalance(balance);
  }, [balance]);

  return(
    <Card className={cn(
      "bg-background/60 hover:bg-background/80 backdrop-blur-md transition-all w-fit", 
      className
    )}>
      <CardContent className="p-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <BadgeEuro className="h-5 w-5 text-muted-foreground" />
            <span className="text-lg font-medium">Disponible</span>
          </div>
          <p className={cn("text-lg font-bold", displayedBalance >= 0 ? "text-green-600" : "text-red-600")}>
            {displayedBalance.toLocaleString('fr-FR')} €
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
