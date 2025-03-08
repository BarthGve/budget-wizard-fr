
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Banknote } from 'lucide-react';
import { useEffect, useState } from "react";

interface ContributorShare {
  name: string;
  start: number;
  end: number;
  amount: number;
}

interface RevenueCardProps {
  totalRevenue: number;
  contributorShares: ContributorShare[];
}

export const RevenueCard = ({
  totalRevenue,
  contributorShares
}: RevenueCardProps) => {
  const [displayedRevenue, setDisplayedRevenue] = useState(totalRevenue);

  // Mettre à jour le montant affiché lorsque totalRevenue change
  useEffect(() => {
    // Animation simple d'interpolation numérique
    const startValue = displayedRevenue;
    const endValue = totalRevenue;
    const duration = 800; // ms
    const startTime = Date.now();
    
    const animateValue = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      
      if (elapsed >= duration) {
        setDisplayedRevenue(endValue);
        return;
      }
      
      const progress = elapsed / duration;
      const currentValue = startValue + (endValue - startValue) * progress;
      setDisplayedRevenue(currentValue);
      
      requestAnimationFrame(animateValue);
    };
    
    requestAnimationFrame(animateValue);
  }, [totalRevenue]);

  return (
    <Card className="bg-background hover:shadow-md transition-all duration-300">
      <CardHeader className="py-[16px]">
        <div className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl">Revenus</CardTitle>
            <Banknote className="h-6 w-6 text-muted-foreground" />
        </div>
        <CardDescription>Des contributeurs</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="font-bold text-xl">{Math.round(displayedRevenue)} €</p>
      </CardContent>
    </Card>
  );
};
