
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Banknote } from 'lucide-react';

interface ContributorShare {
  name: string;
  start: number;
  end: number;
  amount: number;
}

interface RevenueCardProps {
  totalRevenue: number;
  contributorShares: ContributorShare[];
  className?: string;
}

export const RevenueCard = ({
  totalRevenue,
  className
}: RevenueCardProps) => {
  return <Card className={className}>
    <CardHeader className="py-[16px]">
      <div className="flex flex-row items-center justify-between ">
          <CardTitle className="text-2xl">Revenus globaux</CardTitle>
          <Banknote className="h-6 w-6 text-muted-foreground" />
      </div>
      <CardDescription>Somme de l'ensemble des revenus</CardDescription>
    </CardHeader>

    <CardContent className="space-y-4">
      <p className="font-bold text-xl">{Math.round(totalRevenue)} €</p>
    </CardContent>
  </Card>;
};
