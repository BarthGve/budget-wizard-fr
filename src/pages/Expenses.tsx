import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AddExpenseDialog } from "@/components/expenses/AddExpenseDialog";
import { RetailerCard } from "@/components/expenses/RetailerCard";
import { YearlyTotalCard } from "@/components/expenses/YearlyTotalCard";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useRetailers } from "@/components/settings/retailers/useRetailers";
import { useCallback, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { startOfYear, endOfYear, subYears } from "date-fns";
import { CreateRetailerBanner } from "@/components/expenses/CreateRetailerBanner";
import { CreateCategoryBanner } from "@/components/common/CreateCategoryBanner";
import StyledLoader from "@/components/ui/StyledLoader";

const Expenses = () => {
  const queryClient = useQueryClient();
  const {
    retailers
  } = useRetailers();
  const [viewMode, setViewMode] = useState<'monthly' | 'yearly'>('monthly');
  const [addExpenseDialogOpen, setAddExpenseDialogOpen] = useState(false);
  const {
    data: expenses,
    isLoading
  } = useQuery({
    queryKey: ["expenses"],
    queryFn: async () => {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");
      const {
        data,
        error
      } = await supabase.from("expenses").select("*").eq("profile_id", user.id);
      if (error) throw error;
      return data;
    }
  });
  const handleExpenseUpdated = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: ["expenses"]
    });
    setAddExpenseDialogOpen(false);
  }, [queryClient]);
  const expensesByRetailer = retailers?.map(retailer => ({
    retailer,
    expenses: expenses?.filter(expense => expense.retailer_id === retailer.id) || []
  }));

  // Calcul des totaux pour la carte de total annuel
  const now = new Date();
  const currentYearExpenses = expenses?.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate >= startOfYear(now) && expenseDate <= endOfYear(now);
  }) || [];
  const currentYearTotal = currentYearExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const lastYearStart = startOfYear(subYears(now, 1));
  const lastYearEnd = endOfYear(subYears(now, 1));
  const lastYearExpenses = expenses?.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate >= lastYearStart && expenseDate <= lastYearEnd;
  }) || [];
  const lastYearTotal = lastYearExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  if (isLoading) {
    return <StyledLoader/>;
  }
  return <DashboardLayout>
      <div className="grid gap-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-fade-in">Dépenses</h1>
              <p className="text-muted-foreground">Suivez les dépenses que vous réalisez auprès de certaines enseignes.</p>
            </div>
        
            <div className="flex items-center gap-8">
              <div className="flex items-center space-x-2">
                <Switch id="view-mode" checked={viewMode === 'yearly'} onCheckedChange={checked => setViewMode(checked ? 'yearly' : 'monthly')} />
                <Label htmlFor="view-mode">
                  Vue annuelle
                </Label>
              </div>
              <AddExpenseDialog onExpenseAdded={handleExpenseUpdated} open={addExpenseDialogOpen} onOpenChange={setAddExpenseDialogOpen} />
            </div>
          </div>

          <div className="flex gap-4">
            <CreateCategoryBanner />
            <CreateRetailerBanner />
          </div>

          <div className="mt-8">
            <YearlyTotalCard currentYearTotal={currentYearTotal} previousYearTotal={lastYearTotal} />
          </div>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
            {expensesByRetailer?.map(({retailer, expenses: retailerExpenses}) => 
              <RetailerCard 
                key={retailer.id} 
                retailer={retailer} 
                expenses={retailerExpenses} 
                onExpenseUpdated={handleExpenseUpdated} 
                viewMode={viewMode} 
              />
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>;
};

export default Expenses;
