import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { RecurringExpenseDialog } from "@/components/recurring-expenses/RecurringExpenseDialog";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const periodicityLabels = {
  monthly: "Mensuelle",
  quarterly: "Trimestrielle",
  yearly: "Annuelle"
};

const formatDebitDate = (debit_day: number, debit_month: number | null, periodicity: string) => {
  const day = debit_day.toString().padStart(2, '0');
  
  if (periodicity === "monthly") {
    return `Le ${day} de chaque mois`;
  } else {
    const monthName = new Date(0, debit_month! - 1).toLocaleString('fr-FR', { month: 'long' });
    return `Le ${day} ${monthName}`;
  }
};

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

      return data as Array<{
        id: string;
        name: string;
        amount: number;
        category: string;
        periodicity: "monthly" | "quarterly" | "yearly";
        debit_day: number;
        debit_month: number | null;
      }>;
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
            <div>
              <CardTitle>Liste des charges</CardTitle>
              <CardDescription>Gérez vos dépenses récurrentes par catégorie</CardDescription>
            </div>
            <RecurringExpenseDialog trigger={
              <Button variant="outline" size="sm" className="ml-auto">
                <Plus className="mr-2 h-4 w-4" />
                Ajouter une charge
              </Button>
            } />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recurringExpenses?.map(expense => (
                <div key={expense.id} className="flex items-center justify-between border-b pb-3">
                  <div className="space-y-1">
                    <p className="font-medium">{expense.name}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>Catégorie: {expense.category}</span>
                      <span>•</span>
                      <span>Périodicité: {periodicityLabels[expense.periodicity]}</span>
                      <span>•</span>
                      <span>Prélèvement: {formatDebitDate(expense.debit_day, expense.debit_month, expense.periodicity)}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <p className="font-medium">{expense.amount} €</p>
                    <div className="flex space-x-2">
                      <RecurringExpenseDialog 
                        expense={expense} 
                        trigger={
                          <Button variant="ghost" size="sm">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        } 
                      />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Supprimer la charge</AlertDialogTitle>
                            <AlertDialogDescription>
                              Êtes-vous sûr de vouloir supprimer cette charge ? Cette action ne peut pas être annulée.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteExpense(expense.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Supprimer
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default RecurringExpenses;
