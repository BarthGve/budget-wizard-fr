
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
}: RevenueCardProps) => {
  return (
    <Card className="bg-white my-[6px]">
      <CardHeader className="py-[16px]">
        <CardTitle className="text-2xl">Revenus </CardTitle>
        <CardDescription>Total des revenus mensuels</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="font-bold text-2xl">{Math.round(totalRevenue)} €</p>
      </CardContent>
    </Card>
  );
};
