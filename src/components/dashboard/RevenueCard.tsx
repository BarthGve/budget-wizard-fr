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
  contributorShares
}: RevenueCardProps) => {
  return <Card className="bg-white my-[6px]">
      <CardHeader className="py-[16px]">
        <CardTitle>Revenus Totaux</CardTitle>
        <CardDescription>Et répartition par contributeur</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="font-bold text-2xl">{Math.round(totalRevenue)} €</p>
        {contributorShares.length > 1 && <>
            <div className="relative h-2">
              {contributorShares.map((contrib, index) => <div key={contrib.name} className="absolute h-full" style={{
            left: `${contrib.start}%`,
            width: `${contrib.end - contrib.start}%`,
            backgroundColor: index === 0 ? 'rgb(34, 197, 94)' : 'rgb(99, 102, 241)',
            borderRadius: '9999px'
          }} />)}
            </div>
            <div className="space-y-2">
              {contributorShares.map((contrib, index) => <div key={contrib.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{
                backgroundColor: index === 0 ? 'rgb(34, 197, 94)' : 'rgb(99, 102, 241)'
              }} />
                    <span>{contrib.name}</span>
                  </div>
                  <span>{Math.round(contrib.amount)} €</span>
                </div>)}
            </div>
          </>}
      </CardContent>
    </Card>;
};