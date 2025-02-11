
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ContributorShare {
  name: string;
  start: number;
  end: number;
  amount: number;
}

interface ExpensesCardProps {
  totalExpenses: number;
  contributorShares: ContributorShare[];
}

export const ExpensesCard = ({ totalExpenses, contributorShares }: ExpensesCardProps) => {
  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle>Dépenses</CardTitle>
        <CardDescription>Répartition par contributeur</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-3xl font-bold text-violet-500">{Math.round(totalExpenses)} €</p>
        <div className="relative h-2">
          {contributorShares.map((contrib, index) => (
            <div
              key={contrib.name}
              className="absolute h-full"
              style={{
                left: `${contrib.start}%`,
                width: `${contrib.end - contrib.start}%`,
                backgroundColor: index === 0 ? 'rgb(34, 197, 94)' : 'rgb(99, 102, 241)',
                borderRadius: '9999px',
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
                  style={{
                    backgroundColor: index === 0 ? 'rgb(34, 197, 94)' : 'rgb(99, 102, 241)',
                  }}
                />
                <span>{contrib.name}</span>
              </div>
              <span className="font-semibold text-violet-500">{Math.round(contrib.amount)} €</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
