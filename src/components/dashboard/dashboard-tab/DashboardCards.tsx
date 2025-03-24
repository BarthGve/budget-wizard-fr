
import { memo } from "react";
import { RevenueCard } from "../RevenueCard";
import { ExpensesCard } from "../ExpensesCard";
import { CreditCard } from "../CreditCard";
import { SavingsCard } from "../SavingsCard";
import { CardsGrid } from "./CardsGrid";
import { AnimatedCardWrapper } from "./AnimatedCardWrapper";

interface DashboardCardsProps {
  revenue: number;
  expenses: number;
  totalMensualites: number;
  savings: number;
  savingsGoal: number;
  contributorShares: Array<{
    name: string;
    start: number;
    end: number;
    amount: number;
  }>;
  recurringExpenses: Array<{
    amount: number;
    debit_day: number;
    debit_month: number | null;
    periodicity: "monthly" | "quarterly" | "yearly";
  }>;
  currentView: "monthly" | "yearly";
}

/**
 * Composant qui affiche les différentes cartes du tableau de bord
 */
export const DashboardCards = memo(({
  revenue,
  expenses,
  totalMensualites,
  savings,
  savingsGoal,
  contributorShares,
  recurringExpenses,
  currentView = "monthly",
}: DashboardCardsProps) => {
  return (
    <CardsGrid>
      <AnimatedCardWrapper>
        <RevenueCard
          totalRevenue={revenue}
          contributorShares={contributorShares}
        />
      </AnimatedCardWrapper>
      
      <AnimatedCardWrapper>
        <CreditCard
          totalMensualites={totalMensualites}
          totalRevenue={revenue}
          currentView={currentView}
        />
      </AnimatedCardWrapper>
      
      <AnimatedCardWrapper>
        <ExpensesCard
          totalExpenses={expenses}
          recurringExpenses={recurringExpenses}
        />
      </AnimatedCardWrapper>
      
      <AnimatedCardWrapper>
        <SavingsCard
          totalMonthlySavings={savings}
          savingsGoal={savingsGoal}
        />
      </AnimatedCardWrapper>
    </CardsGrid>
  );
});

DashboardCards.displayName = "DashboardCards";
