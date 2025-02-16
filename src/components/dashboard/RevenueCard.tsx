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
}
export const RevenueCard = ({
  totalRevenue
}: RevenueCardProps) => {
  return <Card className="bg-white my-[6px]">
 <CardHeader className="py-[16px]">
      <div className="flex flex-row items-center justify-between ">
          <CardTitle className="text-2xl">Solde</CardTitle>
          <Banknote className="h-6 w-6 text-muted-foreground" />
          </div>
          <CardDescription>Revenus globaux</CardDescription>
        </CardHeader>

      <CardContent className="space-y-4">
        <p className="font-bold text-xl">{Math.round(totalRevenue)} €</p>
      </CardContent>
    </Card>;
};