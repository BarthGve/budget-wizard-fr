import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {ShoppingBasket} from 'lucide-react'  
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
      <div className="flex items-center gap-x-2">
  <ShoppingBasket className="w-6 h-6 text-primary" />
    <CardTitle className="text-2xl">Charges</CardTitle>
    </div>
        <CardDescription>Total des charges mensuelles</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="font-bold text-xl">{Math.round(totalExpenses)} €</p>
      </CardContent>
    </Card>;
};