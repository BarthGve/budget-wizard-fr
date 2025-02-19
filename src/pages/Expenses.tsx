
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExpensesList } from "@/components/properties/ExpensesList";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AddExpenseDialog } from "@/components/properties/AddExpenseDialog";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface Expense {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
}

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchExpenses = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        toast.error("Vous devez être connecté pour voir les dépenses");
        return;
      }

      const { data, error } = await supabase
        .from("property_expenses")
        .select("*")
        .eq("profile_id", session.session.user.id)
        .order("date", { ascending: false });

      if (error) throw error;

      setExpenses(data || []);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      toast.error("Impossible de charger les dépenses");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleExpenseEdit = (expense: Expense) => {
    setSelectedExpense(expense);
    setIsDialogOpen(true);
  };

  const handleExpenseDeleted = () => {
    fetchExpenses();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dépenses</h1>
          <p className="text-muted-foreground">
            Gérez vos dépenses et suivez votre budget
          </p>
        </div>
        <AddExpenseDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          propertyId=""
          onExpenseAdded={fetchExpenses}
          expense={selectedExpense}
        />
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Liste des dépenses</CardTitle>
            <CardDescription>
              Visualisez et gérez toutes vos dépenses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ExpensesList
              expenses={expenses}
              onExpenseDeleted={handleExpenseDeleted}
              onExpenseEdit={handleExpenseEdit}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
