
import { RecurringExpense } from "./types";
import { AnimatedContainer } from "./components/AnimatedContainer";
import { ExpenseSections } from "./components/ExpenseSections";
import { usePeriodicityFilter } from "./hooks/usePeriodicityFilter";

interface RecurringExpensesContainerProps {
  recurringExpenses: RecurringExpense[];
  onDeleteExpense: (id: string) => Promise<void>;
  isLoading?: boolean;
}

export const RecurringExpensesContainer = ({
  recurringExpenses,
  onDeleteExpense,
  isLoading = false
}: RecurringExpensesContainerProps) => {
  const { selectedPeriod, setSelectedPeriod, cardsRef } = usePeriodicityFilter();

  return (
    <AnimatedContainer>
      <div className="w-full max-w-full">
        <ExpenseSections
          recurringExpenses={recurringExpenses}
          onDeleteExpense={onDeleteExpense}
          selectedPeriod={selectedPeriod}
          setSelectedPeriod={setSelectedPeriod}
          cardsRef={cardsRef}
          isLoading={isLoading}
        />
      </div>
    </AnimatedContainer>
  );
};
