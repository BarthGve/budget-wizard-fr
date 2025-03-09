
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
    if (totalRevenue !== displayedRevenue) {
      console.log("Revenue changed:", totalRevenue);
      // Animation simple d'interpolation numérique par centaine
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
        // Calculer la valeur intermédiaire et arrondir par centaine
        const rawValue = startValue + (endValue - startValue) * progress;
        const currentValue = Math.round(rawValue / 100) * 100; // Arrondi à la centaine
        setDisplayedRevenue(currentValue);
        requestAnimationFrame(animateValue);
      };
      
      requestAnimationFrame(animateValue);
    }
  }, [totalRevenue, displayedRevenue]);

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
        <p className="font-bold text-xl">{displayedRevenue.toLocaleString('fr-FR')} €</p>
      </CardContent>
    </Card>
  );
};