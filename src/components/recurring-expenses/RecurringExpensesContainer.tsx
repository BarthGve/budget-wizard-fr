
import { RecurringExpense } from "./types";
import { AnimatedContainer } from "./components/AnimatedContainer";
import { ExpenseSections } from "./components/ExpenseSections";
import { usePeriodicityFilter } from "./hooks/usePeriodicityFilter";

interface RecurringExpensesContainerProps {
  recurringExpenses: RecurringExpense[];
  onDeleteExpense: (id: string) => Promise<void>;
}

export const RecurringExpensesContainer = ({
  recurringExpenses,
  onDeleteExpense
}: RecurringExpensesContainerProps) => {
  const { selectedPeriod, setSelectedPeriod, cardsRef } = usePeriodicityFilter();

  return (
    <AnimatedContainer>
      <ExpenseSections
        recurringExpenses={recurringExpenses}
        onDeleteExpense={onDeleteExpense}
        selectedPeriod={selectedPeriod}
        setSelectedPeriod={setSelectedPeriod}
        cardsRef={cardsRef}
      />
    </AnimatedContainer>
  );
};
