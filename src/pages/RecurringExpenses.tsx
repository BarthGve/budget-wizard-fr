import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, CalendarDays, CalendarRange } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { RecurringExpenseDialog } from "@/components/recurring-expenses/RecurringExpenseDialog";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RecurringExpenseTable } from "@/components/recurring-expenses/RecurringExpenseTable";
interface RecurringExpense {
  id: string;
  name: string;
  amount: number;
  category: string;
  periodicity: "monthly" | "quarterly" | "yearly";
  debit_day: number;
  debit_month: number | null;
  created_at: string;
}
const RecurringExpenses = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
      }
    };
    checkAuth();
  }, [navigate]);
  const {
    data: recurringExpenses,
    isLoading
  } = useQuery({
    queryKey: ["recurring-expenses"],
    queryFn: async () => {
      const {
        data: {
          user
        },
        error: userError
      } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) {
        toast.error("Vous devez être connecté pour voir vos charges récurrentes");
        throw new Error("Not authenticated");
      }
      const {
        data,
        error
      } = await supabase.from("recurring_expenses").select("*").order("created_at", {
        ascending: true
      });
      if (error) {
        console.error("Error fetching recurring expenses:", error);
        toast.error("Erreur lors du chargement des charges récurrentes");
        throw error;
      }
      return data as RecurringExpense[];
    }
  });
  const handleDeleteExpense = async (id: string) => {
    try {
      const {
        error
      } = await supabase.from("recurring_expenses").delete().eq("id", id);
      if (error) throw error;
      queryClient.invalidateQueries({
        queryKey: ["recurring-expenses"]
      });
      toast.success("Dépense supprimée avec succès");
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.error("Erreur lors de la suppression de la dépense");
    }
  };

  // Calculer les sommes par périodicité
  const monthlyTotal = recurringExpenses?.filter(expense => expense.periodicity === "monthly").reduce((sum, expense) => sum + expense.amount, 0) || 0;
  const quarterlyTotal = recurringExpenses?.filter(expense => expense.periodicity === "quarterly").reduce((sum, expense) => sum + expense.amount, 0) || 0;
  const yearlyTotal = recurringExpenses?.filter(expense => expense.periodicity === "yearly").reduce((sum, expense) => sum + expense.amount, 0) || 0;
  if (isLoading) {
    return <DashboardLayout>
      <div>Chargement...</div>
    </DashboardLayout>;
  }
  return <DashboardLayout>
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-fade-in">Charges Récurrentes</h1>
            <p className="text-muted-foreground">Gérez vos dépenses mensuelles régulières</p>
          </div>
          <RecurringExpenseDialog trigger={<Button className="text-primary-foreground bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-md">
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle charge
            </Button>} />
        </div>

        {/* Cards de résumé */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 transition-shadow duration-300">
            <CardHeader className="py-[16px]">
              <div className="flex flex-row items-center justify-between">
                <CardTitle className="text-2xl text-white">Mensuel</CardTitle>
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <CardDescription className="text-white">Total des charges mensuelles</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xl text-white font-bold">{Math.round(monthlyTotal)} €</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 transition-shadow duration-300">
            <CardHeader className="py-[16px]">
              <div className="flex flex-row items-center justify-between">
                <CardTitle className="text-2xl text-white">Trimestriel</CardTitle>
                <CalendarDays className="h-6 w-6 text-white" />
              </div>
              <CardDescription className="text-white">Total des charges trimestrielles</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xl text-white font-bold">{Math.round(quarterlyTotal)} €</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 transition-shadow duration-300">
            <CardHeader className="py-[16px]">
              <div className="flex flex-row items-center justify-between">
                <CardTitle className="text-2xl text-white">Annuel</CardTitle>
                <CalendarRange className="h-6 w-6 text-white" />
              </div>
              <CardDescription className="text-white">Total des charges annuelles</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xl text-white font-bold">{Math.round(yearlyTotal)} €</p>
            </CardContent>
          </Card>
        </div>

        <RecurringExpenseTable expenses={recurringExpenses || []} onDeleteExpense={handleDeleteExpense} />   
      </div>
    </DashboardLayout>;
};
export default RecurringExpenses;