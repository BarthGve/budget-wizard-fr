
import { useParams, Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RetailerHeader } from "@/components/expenses/retailer-detail/RetailerHeader";
import { RetailerStats } from "@/components/expenses/retailer-detail/RetailerStats";
import { RetailerExpensesTable } from "@/components/expenses/retailer-detail/RetailerExpensesTable";
import { useRetailerExpenseStats } from "@/components/expenses/retailer-detail/useRetailerExpenseStats";
import { RetailerYearlyArchives } from "@/components/expenses/retailer-detail/RetailerYearlyArchives";
import { RetailerExpensesChart } from "@/components/expenses/retailer-chart";
import { useRetailerDetail } from "@/components/expenses/retailer-detail/useRetailerDetail";
import { RetailerDialogs } from "@/components/expenses/retailer-detail/RetailerDialogs";

const RetailerDetail = () => {
  const { id } = useParams();
  
  // Utiliser le hook personnalisé pour gérer les données et fonctions
  const {
    retailer,
    expenses,
    isLoadingRetailer,
    isLoadingExpenses,
    expenseToEdit,
    expenseToView,
    editDialogOpen,
    detailsDialogOpen,
    addExpenseDialogOpen,
    setEditDialogOpen,
    setDetailsDialogOpen,
    setAddExpenseDialogOpen,
    handleViewExpenseDetails,
    handleEditExpense,
    handleDeleteExpense,
    handleExpenseUpdated,
    handleAddExpense
  } = useRetailerDetail(id);

  useEffect(() => {
    console.log("RetailerDetail mounted with id:", id);
    
    return () => {
      console.log("RetailerDetail unmounted");
    };
  }, [id]);

  // Utiliser les statistiques des dépenses
  const {
    currentYearExpenses,
    monthlyTotal,
    monthlyCount,
    yearlyTotal,
    yearlyCount,
    monthlyAverage,
    monthlyAverageCount,
    previousMonthTotal,
    previousYearTotal
  } = useRetailerExpenseStats(expenses);

  if (isLoadingRetailer) {
    return (
      <DashboardLayout>
        <div className="space-y-4 mt-4">
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

  const currentYear = new Date().getFullYear();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <RetailerHeader 
          retailer={retailer} 
          onAddExpense={handleAddExpense} 
        />

        <RetailerStats
          monthlyTotal={monthlyTotal}
          monthlyCount={monthlyCount}
          yearlyTotal={yearlyTotal}
          yearlyCount={yearlyCount}
          monthlyAverage={monthlyAverage}
          monthlyAverageCount={monthlyAverageCount}
          previousMonthTotal={previousMonthTotal}
          previousYearTotal={previousYearTotal}
        />
        
        {expenses && expenses.length > 0 && (
          <RetailerExpensesChart 
            expenses={expenses} 
            isLoading={isLoadingExpenses}
          />
        )}

        <RetailerExpensesTable
          expenses={currentYearExpenses}
          isLoading={isLoadingExpenses}
          onEditExpense={handleEditExpense}
          onDeleteExpense={handleDeleteExpense}
          onViewDetails={handleViewExpenseDetails}
          currentYear={currentYear}
        />

     
        {expenses && expenses.length > 0 && (
          <RetailerYearlyArchives
            expenses={expenses}
            currentYear={currentYear}
          />
        )}
       
        
        <RetailerDialogs
          expenseToEdit={expenseToEdit}
          expenseToView={expenseToView}
          editDialogOpen={editDialogOpen}
          detailsDialogOpen={detailsDialogOpen}
          addExpenseDialogOpen={addExpenseDialogOpen}
          setEditDialogOpen={setEditDialogOpen}
          setDetailsDialogOpen={setDetailsDialogOpen}
          setAddExpenseDialogOpen={setAddExpenseDialogOpen}
          handleExpenseUpdated={handleExpenseUpdated}
          retailer={retailer}
        />
      </div>
    </DashboardLayout>
  );
};

export default RetailerDetail;
