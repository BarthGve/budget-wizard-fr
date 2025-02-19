
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AddExpenseDialog } from "@/components/expenses/AddExpenseDialog";
import { RetailerCard } from "@/components/expenses/RetailerCard";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useRetailers } from "@/components/settings/retailers/useRetailers";
import { useCallback } from "react";

const Expenses = () => {
  const queryClient = useQueryClient();
  const { retailers } = useRetailers();

  const { data: expenses } = useQuery({
    queryKey: ["expenses"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("expenses")
        .select("*")
        .eq("profile_id", user.id);

      if (error) throw error;
      return data;
    },
  });

  const handleExpenseUpdated = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["expenses"] });
  }, [queryClient]);

  const expensesByRetailer = retailers?.map(retailer => ({
    retailer,
    expenses: expenses?.filter(expense => expense.retailer_id === retailer.id) || []
  }));

  return (
    <DashboardLayout>
      <div className="container mx-auto p-4 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dépenses</h1>
          <AddExpenseDialog onExpenseAdded={handleExpenseUpdated} />
        </div>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {expensesByRetailer?.map(({ retailer, expenses: retailerExpenses }) => (
            <RetailerCard 
              key={retailer.id}
              retailer={retailer}
              expenses={retailerExpenses}
              onExpenseUpdated={handleExpenseUpdated}
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Expenses;
