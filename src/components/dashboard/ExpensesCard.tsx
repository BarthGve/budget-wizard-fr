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
export const ExpensesCard = ({
  totalExpenses
}: ExpensesCardProps) => {
  return <Card className="bg-white my-[4px]">
      <CardHeader className="py-[16px]">
        <CardTitle className="text-2xl">Charges </CardTitle>
        <CardDescription>Total des charges mensuelles</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="font-bold text-xl">{Math.round(totalExpenses)} €</p>
      </CardContent>
    </Card>;
};