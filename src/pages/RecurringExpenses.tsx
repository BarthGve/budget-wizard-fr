
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface RecurringExpense {
  id: string;
  name: string;
  amount: number;
  category: string;
}

const RecurringExpenses = () => {
  const queryClient = useQueryClient();

  const { data: recurringExpenses, isLoading } = useQuery({
    queryKey: ["recurring-expenses"],
    queryFn: async () => {
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
    },
  });

  const handleDeleteExpense = async (id: string) => {
    try {
      const { error } = await supabase
        .from("recurring_expenses")
        .delete()
        .eq("id", id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["recurring-expenses"] });
      toast.success("Dépense supprimée avec succès");
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.error("Erreur lors de la suppression de la dépense");
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div>Chargement...</div>
      </DashboardLayout>
    );
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
              <CardTitle>Charges Mensuelles Récurrentes</CardTitle>
              <CardDescription>Gérez vos dépenses récurrentes par catégorie</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="ml-auto">
              <Plus className="mr-2 h-4 w-4" />
              Ajouter une charge
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recurringExpenses?.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between border-b pb-3"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{expense.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Catégorie: {expense.category}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <p className="font-medium">{expense.amount} €</p>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteExpense(expense.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
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
