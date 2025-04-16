
import { Button } from "@/components/ui/button";
import { BarChart } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCategoryColor } from "@/utils/colors";
import { cn } from "@/lib/utils";

interface RecurringExpense {
  id: string;
  name: string;
  amount: number;
}

interface RecurringExpensesCardProps {
  recurringExpenses: RecurringExpense[];
  totalExpenses: number;
}

export const RecurringExpensesCard = ({ recurringExpenses, totalExpenses }: RecurringExpensesCardProps) => {
  return (
    <Card className="col-span-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle>Répartition des Dépenses Récurrentes</CardTitle>
          <CardDescription>Vue d'ensemble par catégorie</CardDescription>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          asChild
          className="hover:bg-primary/10 hover:text-primary border-primary/20"
        >
          <Link to="/recurring-expenses">
            <BarChart className="mr-2 h-4 w-4" />
            Gérer les charges
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recurringExpenses?.map((expense, index) => (
            <div key={expense.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium dark:text-gray-200">{expense.name}</span>
                <span className="text-primary font-semibold dark:text-primary-300">{Math.round(expense.amount)} €</span>
              </div>
              <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(expense.amount / totalExpenses) * 100}%`,
                    backgroundColor: getCategoryColor(index),
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
