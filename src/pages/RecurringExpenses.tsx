
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
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
}

const RecurringExpenses = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
      }
    };
    checkAuth();
  }, [navigate]);

  const { data: recurringExpenses, isLoading } = useQuery({
    queryKey: ["recurring-expenses"],
    queryFn: async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) {
        toast.error("Vous devez être connecté pour voir vos charges récurrentes");
        throw new Error("Not authenticated");
      }

      const { data, error } = await supabase
        .from("recurring_expenses")
        .select("*")
        .order("created_at", { ascending: true });

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
      const { error } = await supabase.from("recurring_expenses").delete().eq("id", id);
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

  if (isLoading) {
    return <DashboardLayout>
      <div>Chargement...</div>
    </DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Charges Récurrentes</h1>
            <p className="text-muted-foreground">
              Gérez vos dépenses mensuelles récurrentes
            </p>
          </div>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
         
            <RecurringExpenseDialog trigger={
              <Button variant="outline" size="sm" className="ml-auto bg-primary text-primary-foreground hover:bg-primary-hover">
                <Plus className="mr-2 h-4 w-4" />
                Ajouter une charge
              </Button>
            } />
          </CardHeader>
          <CardContent>
            <RecurringExpenseTable 
              expenses={recurringExpenses || []}
              onDeleteExpense={handleDeleteExpense}
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default RecurringExpenses;
