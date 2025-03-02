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

  // Use effect to animate the total when it changes
  useEffect(() => {
    setDisplayedRevenue(totalRevenue);
  }, [totalRevenue]);
  return <Card className="bg-background hover:shadow-md transition-all duration-300">
      <CardHeader className="py-[16px]">
        <div className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl">Revenus globaux</CardTitle>
            <Banknote className="h-6 w-6 text-muted-foreground" />
        </div>
        <CardDescription>Des contributeurs</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="font-bold text-xl">{Math.round(displayedRevenue)} €</p>
        
    
      </CardContent>
    </Card>;
};