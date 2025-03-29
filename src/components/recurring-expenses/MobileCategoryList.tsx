
import { motion } from "framer-motion";
import { RecurringExpense } from "./types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ChevronRight, ListFilter } from "lucide-react";
import { formatCurrency } from "@/utils/format";
import { itemVariants } from "./animations/AnimationVariants";

interface MobileCategoryListProps {
  expenses: RecurringExpense[];
  selectedPeriod: "monthly" | "quarterly" | "yearly" | null;
}

/**
 * Composant qui affiche une liste simple des catégories de charges avec leurs montants
 * pour les appareils mobiles
 */
export const MobileCategoryList = ({ expenses, selectedPeriod }: MobileCategoryListProps) => {
  // Filtrer les dépenses selon la période sélectionnée ou prendre les mensuelles par défaut
  const filteredExpenses = selectedPeriod 
    ? expenses.filter(expense => expense.periodicity === selectedPeriod)
    : expenses.filter(expense => expense.periodicity === "monthly");

  // Regrouper les dépenses par catégorie et calculer les totaux
  const categoriesMap = new Map<string, number>();
  filteredExpenses.forEach(expense => {
    const currentTotal = categoriesMap.get(expense.category) || 0;
    categoriesMap.set(expense.category, currentTotal + expense.amount);
  });

  // Convertir la Map en tableau et trier par montant décroissant
  const categoriesList = Array.from(categoriesMap.entries())
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);

  // Périodicité à afficher
  const periodLabel = selectedPeriod 
    ? selectedPeriod === "monthly" ? "mensuelles" : selectedPeriod === "quarterly" ? "trimestrielles" : "annuelles"
    : "mensuelles";

  return (
    <motion.div variants={itemVariants}>
      <Card className={cn(
        "w-full relative overflow-hidden",
        "border shadow-sm",
        "bg-white border-blue-100",
        "dark:bg-gray-800/90 dark:border-blue-800/50 dark:shadow-blue-900/10",
        "mb-6"
      )}>
        <div className={cn(
          "absolute inset-0 opacity-5",
          "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-400 via-blue-300 to-transparent",
          "dark:opacity-10 dark:from-blue-400 dark:via-blue-500 dark:to-transparent"
        )} />
        
        <CardHeader className="pb-2 relative z-10">
          <div className="flex items-center gap-2">
            <div className={cn(
              "p-1.5 rounded",
              "bg-blue-100",
              "dark:bg-blue-800/40"
            )}>
              <ListFilter className={cn(
                "h-5 w-5",
                "text-blue-600",
                "dark:text-blue-400"
              )} />
            </div>
            <div>
              <CardTitle className={cn(
                "text-lg font-semibold",
                "text-blue-700",
                "dark:text-blue-300"
              )}>
                Charges par catégorie
              </CardTitle>
              <CardDescription className={cn(
                "text-sm",
                "text-blue-600/80",
                "dark:text-blue-400/90"
              )}>
                Dépenses {periodLabel} regroupées
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0 pb-4 relative z-10">
          {categoriesList.length > 0 ? (
            <ul className="space-y-2 mt-2">
              {categoriesList.map((item, index) => (
                <li 
                  key={item.category}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-md",
                    "border-l-4 border-blue-500 dark:border-blue-400",
                    "bg-blue-50/50 dark:bg-blue-900/20"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <ChevronRight className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {item.category}
                    </span>
                  </div>
                  <span className="font-mono font-semibold text-blue-600 dark:text-blue-300">
                    {formatCurrency(item.total)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              Aucune donnée disponible pour cette période
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
