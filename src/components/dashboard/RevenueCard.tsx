
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCategoryColor } from "@/utils/colors";

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

export const RevenueCard = ({ totalRevenue, contributorShares }: RevenueCardProps) => {
  return (
    <Card className="card-hover">
      <CardHeader>
        <CardTitle>Revenus Totaux</CardTitle>
        <CardDescription>Répartition par contributeur</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-3xl font-bold">{Math.round(totalRevenue)} €</p>
        <div className="relative h-4">
          {contributorShares.map((contrib, index) => (
            <div
              key={contrib.name}
              className="absolute h-full rounded-full"
              style={{
                left: `${contrib.start}%`,
                width: `${contrib.end - contrib.start}%`,
                backgroundColor: getCategoryColor(index),
              }}
            />
          ))}
        </div>
        <div className="space-y-2">
          {contributorShares.map((contrib, index) => (
            <div key={contrib.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div 
                  className="h-3 w-3 rounded-full" 
                  style={{ backgroundColor: getCategoryColor(index) }}
                />
                <span>{contrib.name}</span>
              </div>
              <span>{Math.round(contrib.amount)} €</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
