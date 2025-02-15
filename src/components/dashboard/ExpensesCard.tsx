
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ShoppingBasket } from 'lucide-react'  

interface ExpensesCardProps {
  totalExpenses: number;
  recurringExpenses: Array<{
    amount: number;
    debit_day: number;
  }>;
}

export const ExpensesCard = ({
  totalExpenses,
  recurringExpenses,
}: ExpensesCardProps) => {
  const currentDay = new Date().getDate();
  const paidExpenses = recurringExpenses.reduce((sum, expense) => {
    // Si nous sommes après le jour de prélèvement, on considère que c'est payé
    if (currentDay >= expense.debit_day) {
      return sum + expense.amount;
    }
    return sum;
  }, 0);

  const progressPercentage = (paidExpenses / totalExpenses) * 100;

  return <Card className="bg-white my-[4px]">
  <CardHeader className="py-[16px]">
    <div className="flex items-center gap-x-2">
      <ShoppingBasket className="w-6 h-6 text-primary" />
      <CardTitle className="text-2xl">Charges</CardTitle>
    </div>
    <CardDescription>A payer en ${currentMonthName} ${new Date().getFullYear()}</CardDescription>
  </CardHeader>
  <CardContent>
    <div className="space-y-2">
      <div className="flex items-center gap-x-4">
        <p className="font-bold text-xl whitespace-nowrap">{Math.round(totalExpenses)} €</p>
        <Progress 
          value={progressPercentage} 
          className="flex-grow"
        />
      </div>
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Payé : {Math.round(paidExpenses)} €</span>
        <span>Reste : {Math.round(totalExpenses - paidExpenses)} €</span>
      </div>
    </div>
  </CardContent>
</Card>;
};
