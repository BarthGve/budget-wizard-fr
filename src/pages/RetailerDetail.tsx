import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { EditExpenseDialog } from "@/components/expenses/EditExpenseDialog";
import { RetailerHeader } from "@/components/expenses/retailer-detail/RetailerHeader";
import { RetailerStats } from "@/components/expenses/retailer-detail/RetailerStats";
import { RetailerExpensesTable } from "@/components/expenses/retailer-detail/RetailerExpensesTable";
import { useRetailerExpenseStats } from "@/components/expenses/retailer-detail/useRetailerExpenseStats";
import { ExpenseActionDetails } from "@/components/expenses/ExpenseActionDetails";

interface Expense {
  id: string;
  date: string;
  amount: number;
  comment?: string;
  retailer_id: string;
}

const RetailerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expenseToEdit, setExpenseToEdit] = useState<Expense | null>(null);
  const [expenseToView, setExpenseToView] = useState<Expense | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  useEffect(() => {
    console.log("RetailerDetail mounted with id:", id);
    
    return () => {
      console.log("RetailerDetail unmounted");
    };
  }, [id]);

  const { data: retailer, isLoading: isLoadingRetailer } = useQuery({
    queryKey: ["retailer", id],
    queryFn: async () => {
      console.log("Fetching retailer with id:", id);
      const { data, error } = await supabase
        .from("retailers")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching retailer:", error);
        toast.error("Erreur lors du chargement des données de l'enseigne");
        throw error;
      }

      console.log("Retailer data fetched successfully:", data);
      return data;
    }
  });

  const { data: expenses, isLoading: isLoadingExpenses, refetch: refetchExpenses } = useQuery({
    queryKey: ["retailer-expenses", id],
    queryFn: async () => {
      console.log("Fetching expenses for retailer:", id);
      const { data, error } = await supabase
        .from("expenses")
        .select("*")
        .eq("retailer_id", id)
        .order("date", { ascending: false });

      if (error) {
        console.error("Error fetching expenses:", error);
        toast.error("Erreur lors du chargement des dépenses");
        throw error;
      }

      console.log("Expenses fetched successfully, count:", data?.length);
      return data;
    },
    enabled: !!id
  });

  const {
    currentYearExpenses,
    monthlyTotal,
    monthlyCount,
    yearlyTotal,
    yearlyCount,
    monthlyAverage,
    monthlyAverageCount
  } = useRetailerExpenseStats(expenses);

  const handleViewExpenseDetails = (expense: Expense) => {
    setExpenseToView(expense);
    setDetailsDialogOpen(true);
  };

  const handleEditExpense = (expense: Expense) => {
    setExpenseToEdit(expense);
    setEditDialogOpen(true);
  };

  const handleDeleteExpense = async (expenseId: string) => {
    try {
      const { error } = await supabase
        .from("expenses")
        .delete()
        .eq("id", expenseId);

      if (error) {
        console.error("Error deleting expense:", error);
        toast.error("Erreur lors de la suppression de la dépense");
        return;
      }

      toast.success("Dépense supprimée avec succès");
      refetchExpenses();
    } catch (error) {
      console.error("Error in delete operation:", error);
      toast.error("Une erreur s'est produite");
    }
  };

  const handleExpenseUpdated = () => {
    setEditDialogOpen(false);
    refetchExpenses();
  };

  if (isLoadingRetailer) {
    return (
      <DashboardLayout>
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
          <Skeleton className="h-64" />
        </div>
      </DashboardLayout>
    );
  }

  if (!retailer) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Enseigne non trouvée</h1>
          <p className="text-muted-foreground">
            L'enseigne que vous recherchez n'existe pas ou a été supprimée.
          </p>
          <Button asChild className="mt-8">
            <Link to="/expenses">Retour aux dépenses</Link>
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <RetailerHeader retailer={retailer} />

        <RetailerStats
          monthlyTotal={monthlyTotal}
          monthlyCount={monthlyCount}
          yearlyTotal={yearlyTotal}
          yearlyCount={yearlyCount}
          monthlyAverage={monthlyAverage}
          monthlyAverageCount={monthlyAverageCount}
        />

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Historique des achats de l'année {new Date().getFullYear()}</h2>
          
          <RetailerExpensesTable
            expenses={currentYearExpenses}
            isLoading={isLoadingExpenses}
            onEditExpense={handleEditExpense}
            onDeleteExpense={handleDeleteExpense}
            onViewDetails={handleViewExpenseDetails}
          />
        </Card>

        <EditExpenseDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          expense={expenseToEdit}
          onExpenseUpdated={handleExpenseUpdated}
        />

        <ExpenseActionDetails
          expense={expenseToView}
          open={detailsDialogOpen}
          onOpenChange={setDetailsDialogOpen}
        />
      </div>
    </DashboardLayout>
  );
};

export default RetailerDetail;
