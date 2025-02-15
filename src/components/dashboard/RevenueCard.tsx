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
      <div className="flex items-center gap-x-2">
  <Banknote className="w-6 h-6 text-primary" />
    <CardTitle className="text-2xl">Revenus</CardTitle>
    </div>
        <CardDescription>Total des revenus mensuels</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="font-bold text-xl">{Math.round(totalRevenue)} €</p>
      </CardContent>
    </Card>;
};