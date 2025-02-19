
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ShoppingBasket } from 'lucide-react'  
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const currentDay = new Date().getDate();
  const paidExpenses = recurringExpenses.reduce((sum, expense) => {
    if (currentDay >= expense.debit_day) {
      return sum + expense.amount;
    }
    return sum;
  }, 0);

  const progressPercentage = (paidExpenses / totalExpenses) * 100;
  const currentMonthName = new Date().toLocaleString('fr-FR', { month: 'long' });

  return <Card 
    className="bg-background cursor-pointer hover:bg-accent/10 transition-colors"
    onClick={() => navigate("/recurring-expenses")}
  >
    <CardHeader className="py-[16px]">
      <div className="flex flex-row items-center justify-between ">
          <CardTitle className="text-2xl">Charges</CardTitle>
          <ShoppingBasket className="h-6 w-6 text-muted-foreground" />
      </div>
      <CardDescription>Du mois de {currentMonthName}</CardDescription>
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
