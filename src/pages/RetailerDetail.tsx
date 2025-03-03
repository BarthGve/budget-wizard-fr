
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { formatCurrency } from "@/utils/format";
import { useState } from "react";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { RetailerStatsCard } from "@/components/expenses/RetailerStatsCard";
import { RetailerExpenseActions } from "@/components/expenses/RetailerExpenseActions";
import { EditExpenseDialog } from "@/components/expenses/EditExpenseDialog";

const RetailerDetail = () => {
  const { id } = useParams();
  const [expenseToEdit, setExpenseToEdit] = useState<any>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  // Récupérer l'enseigne
  const { data: retailer, isLoading: isLoadingRetailer } = useQuery({
    queryKey: ["retailer", id],
    queryFn: async () => {
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

      return data;
    }
  });

  // Récupérer les dépenses pour cette enseigne
  const { data: expenses, isLoading: isLoadingExpenses, refetch: refetchExpenses } = useQuery({
    queryKey: ["retailer-expenses", id],
    queryFn: async () => {
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

      return data;
    },
    enabled: !!id
  });

  // Calculs des statistiques
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Filtrer les dépenses du mois et de l'année en cours
  const currentMonthExpenses = expenses?.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
  }) || [];

  const currentYearExpenses = expenses?.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getFullYear() === currentYear;
  }) || [];

  // Calculer les totaux
  const monthlyTotal = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const monthlyCount = currentMonthExpenses.length;
  
  const yearlyTotal = currentYearExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const yearlyCount = currentYearExpenses.length;

  // Calculer la moyenne mensuelle
  const allExpenses = expenses || [];
  const expenseDates = allExpenses.map(expense => new Date(expense.date));
  
  let monthlyAverage = 0;
  let monthlyAverageCount = 0;
  
  if (expenseDates.length > 0) {
    const oldestDate = new Date(Math.min(...expenseDates.map(date => date.getTime())));
    const totalMonths = 
      (currentDate.getFullYear() - oldestDate.getFullYear()) * 12 + 
      (currentDate.getMonth() - oldestDate.getMonth()) + 1;
    
    monthlyAverage = allExpenses.reduce((sum, expense) => sum + expense.amount, 0) / totalMonths;
    monthlyAverageCount = allExpenses.length / totalMonths;
  }

  const handleEditExpense = (expense: any) => {
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
        {/* Header avec bouton retour et titre */}
        <div className="flex flex-col space-y-2">
          <Link 
            to="/expenses" 
            className="flex items-center text-muted-foreground hover:text-primary transition-colors w-fit"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            <span>Retour aux dépenses</span>
          </Link>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold">{retailer.name}</h1>
              {retailer.logo_url && (
                <img 
                  src={retailer.logo_url} 
                  alt={`Logo ${retailer.name}`} 
                  className="h-10 w-10 rounded-full object-contain"
                />
              )}
            </div>
          </div>
        </div>

        {/* Cartes de statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <RetailerStatsCard
            title="Dépenses du mois"
            amount={monthlyTotal}
            count={monthlyCount}
            label="achats ce mois-ci"
            className="bg-gradient-to-br from-blue-500 to-indigo-600"
          />
          
          <RetailerStatsCard
            title="Dépenses de l'année"
            amount={yearlyTotal}
            count={yearlyCount}
            label="achats cette année"
            className="bg-gradient-to-br from-purple-500 to-pink-600"
          />
          
          <RetailerStatsCard
            title="Moyenne mensuelle"
            amount={monthlyAverage}
            count={monthlyAverageCount}
            label="achats par mois"
            className="bg-gradient-to-br from-orange-500 to-amber-600"
          />
        </div>

        {/* Tableau des dépenses */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Historique des achats de l'année {currentYear}</h2>
          
          {isLoadingExpenses ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : currentYearExpenses.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">
              Aucune dépense enregistrée pour cette année
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Commentaire</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentYearExpenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell>
                        {new Date(expense.date).toLocaleDateString('fr-FR')}
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(expense.amount)}
                      </TableCell>
                      <TableCell>
                        {expense.comment || "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <RetailerExpenseActions
                          onEdit={() => handleEditExpense(expense)}
                          onDelete={() => handleDeleteExpense(expense.id)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>

        {/* Dialog pour modifier une dépense */}
        <EditExpenseDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          expense={expenseToEdit}
          onExpenseUpdated={handleExpenseUpdated}
        />
      </div>
    </DashboardLayout>
  );
};

export default RetailerDetail;
