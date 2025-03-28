
import { motion } from "framer-motion";
import { RecurringExpense } from "../types";
import { RecurringExpenseTable } from "../table/RecurringExpenseTable";
import { CreateCategoryBanner } from "@/components/common/CreateCategoryBanner";
import { RecurringExpensesSummaryCards } from "../RecurringExpensesSummaryCards";
import { itemVariants } from "../animations/AnimationVariants";
import { RecurringExpensesHeader } from "../RecurringExpensesHeader";
import { MutableRefObject } from "react";
import { RecurringExpensesCategoryChart } from "../RecurringExpensesCategoryChart";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface ExpenseSectionsProps {
  recurringExpenses: RecurringExpense[];
  onDeleteExpense: (id: string) => Promise<void>;
  selectedPeriod: "monthly" | "quarterly" | "yearly" | null;
  setSelectedPeriod: (period: "monthly" | "quarterly" | "yearly" | null) => void;
  cardsRef: MutableRefObject<HTMLDivElement | null>;
}

/**
 * Sections principales pour l'affichage des charges récurrentes
 */
export const ExpenseSections = ({
  recurringExpenses,
  onDeleteExpense,
  selectedPeriod,
  setSelectedPeriod,
  cardsRef
}: ExpenseSectionsProps) => {
  // Calculer les totaux par périodicité
  const monthlyTotal = recurringExpenses?.filter(expense => expense.periodicity === "monthly").reduce((sum, expense) => sum + expense.amount, 0) || 0;
  const quarterlyTotal = recurringExpenses?.filter(expense => expense.periodicity === "quarterly").reduce((sum, expense) => sum + expense.amount, 0) || 0;
  const yearlyTotal = recurringExpenses?.filter(expense => expense.periodicity === "yearly").reduce((sum, expense) => sum + expense.amount, 0) || 0;

  // Filtrer les dépenses en fonction de la période sélectionnée
  const filteredExpenses = selectedPeriod 
    ? recurringExpenses.filter(expense => expense.periodicity === selectedPeriod)
    : recurringExpenses;
    
  // Détection des écrans mobiles
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div className="space-y-6">
      <RecurringExpensesHeader />

      <motion.div variants={itemVariants}>
        <CreateCategoryBanner />
      </motion.div>

      <div ref={cardsRef}>
        <RecurringExpensesSummaryCards
          monthlyTotal={monthlyTotal}
          quarterlyTotal={quarterlyTotal}
          yearlyTotal={yearlyTotal}
          onPeriodSelect={setSelectedPeriod}
          selectedPeriod={selectedPeriod}
        />
      </div>

      {/* Graphique des dépenses par catégorie */}
      <RecurringExpensesCategoryChart 
        expenses={recurringExpenses} 
        selectedPeriod={selectedPeriod} 
      />

      {/* Masquer le tableau sur mobile */}
      {!isMobile && (
        <motion.div 
          className="w-full overflow-hidden"
          variants={itemVariants}
        >
          <RecurringExpenseTable 
            expenses={filteredExpenses} 
            onDeleteExpense={onDeleteExpense}
            allExpenses={recurringExpenses} // Transmettre toutes les charges non filtrées
          />
        </motion.div>
      )}
    </div>
  );
};
