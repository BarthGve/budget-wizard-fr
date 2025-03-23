
import { Card, CardContent } from "@/components/ui/card";
import { BadgeEuro } from 'lucide-react';
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface GlobalBalanceCardProps {
  balance: number;
  className?: string;
}

export const GlobalBalanceCard = ({
  balance,
  className
}: GlobalBalanceCardProps) => {
  const [displayedBalance, setDisplayedBalance] = useState(balance);
  const isMobile = useIsMobile();
  
  // Mettre à jour le solde affiché avec animation lors des changements
  useEffect(() => {
    if (balance !== displayedBalance) {
      console.log("Balance changed:", balance);
      
      // Animation simple d'interpolation numérique par dizaine
      const startValue = displayedBalance;
      const endValue = balance;
      const duration = 800; // ms
      const startTime = Date.now();
      
      const animateValue = () => {
        const now = Date.now();
        const elapsed = now - startTime;
        
        if (elapsed >= duration) {
          setDisplayedBalance(endValue);
          return;
        }
        
        const progress = elapsed / duration;
        // Calculer la valeur intermédiaire et arrondir par dizaine
        const rawValue = startValue + (endValue - startValue) * progress;
        const currentValue = Math.round(rawValue / 100) * 100; // Arrondi à la dizaine
        setDisplayedBalance(currentValue);
        
        requestAnimationFrame(animateValue);
      };
      
      requestAnimationFrame(animateValue);
    }
  }, [balance, displayedBalance]);

  return(
    <Card className={cn(
      "bg-background/60 hover:bg-background/80 backdrop-blur-md transition-all w-fit", 
      // Adapté pour mobile - taille plus compacte et meilleure lisibilité
      isMobile ? "scale-90 origin-top-right" : "",
      className
    )}>
      <CardContent className={cn(
        "p-4",
        // Rendre plus compact sur mobile
        isMobile && "p-3"
      )}>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <BadgeEuro className="h-5 w-5 text-muted-foreground" />
            <span className={cn(
              "font-medium",
              // Texte plus petit sur mobile
              isMobile ? "text-base" : "text-lg"
            )}>Disponible</span>
          </div>
          <p className={cn(
            "font-bold", 
            isMobile ? "text-base" : "text-lg",
            displayedBalance >= 0 ? "text-green-600" : "text-red-600"
          )}>
            {displayedBalance.toLocaleString('fr-FR')} €
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
