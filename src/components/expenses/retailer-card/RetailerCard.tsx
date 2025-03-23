
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { RetailerCardContent } from "./RetailerCardContent";
import { RetailerExpensesDialog } from "../RetailerExpensesDialog";
import { AddExpenseDialog } from "../AddExpenseDialog";

interface RetailerCardProps {
  retailer: {
    id: string;
    name: string;
    logo_url?: string;
  };
  expenses: Array<{
    id: string;
    date: string;
    amount: number;
    comment?: string;
  }>;
  onExpenseUpdated: () => void;
  viewMode: "monthly" | "yearly";
  colorScheme?: "blue" | "purple" | "amber";
}

export function RetailerCard({
  retailer,
  expenses,
  onExpenseUpdated,
  viewMode,
  colorScheme = "blue",
}: RetailerCardProps) {
  const [expensesDialogOpen, setExpensesDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const handleExpenseUpdated = () => {
    setExpensesDialogOpen(false);
    setAddDialogOpen(false);
    onExpenseUpdated();
  };

  const handleAddExpense = () => {
    setAddDialogOpen(true);
  };

  return (
    <>
      <Card 
        className={cn(
          "overflow-hidden transition-all duration-200 h-full relative w-full",
          "border shadow-sm hover:shadow-md hover:translate-y-[-5px]",
          "bg-white border-gray-100",
          "dark:bg-gray-800/90 dark:hover:bg-gray-800/70 dark:border-gray-700/50"
        )}
      >
        {/* Fond radial gradient ultra-subtil */}
        <div className={cn(
          "absolute inset-0",
          "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-200 via-gray-100 to-transparent opacity-[0.01]",
          "dark:from-gray-500 dark:via-gray-600 dark:to-transparent dark:opacity-[0.015]"
        )} />
        
        <RetailerCardContent 
          retailer={retailer}
          expenses={expenses}
          viewMode={viewMode}
          onAddExpense={handleAddExpense}
        />
      </Card>

      <RetailerExpensesDialog
        retailer={retailer}
        expenses={expenses}
        open={expensesDialogOpen}
        onOpenChange={setExpensesDialogOpen}
        onExpenseUpdated={handleExpenseUpdated}
      />

      <AddExpenseDialog
        onExpenseAdded={handleExpenseUpdated}
        preSelectedRetailer={retailer}
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
      />
    </>
  );
}
