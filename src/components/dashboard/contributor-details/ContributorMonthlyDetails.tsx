import { Card } from "@/components/ui/card";
import { PaginationControls } from "@/components/properties/expenses/PaginationControls";
import { Euro, CreditCard, HomeIcon, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContributorMonthlyDetailsProps {
  expenses: Array<{
    id: string;
    name?: string;
    nom_credit?: string;
    category?: string;
    nom_domaine?: string;
    amount?: number;
    montant_mensualite?: number;
  }>;
  currentPage: number;
  totalPages: number;
  contributorPercentage: number;
  onPageChange: (page: number) => void;
  type?: "expense" | "credit";
}

export function ContributorMonthlyDetails({ 
  expenses, 
  currentPage, 
  totalPages,
  contributorPercentage,
  onPageChange,
  type = "expense"
}: ContributorMonthlyDetailsProps) {
  const isCredit = type === "credit";

  return (
    <Card className={cn(
      "overflow-hidden border-0 shadow-md",
      "bg-white dark:bg-gray-800",
      "ring-1 ring-amber-100/50 dark:ring-amber-700/20"
    )}>
      {/* En-tête stylisé */}
      <div className={cn(
        "px-5 py-4 flex items-center justify-between",
        "border-b border-amber-100/70 dark:border-amber-800/30",
        "bg-gradient-to-r from-amber-50/80 to-transparent",
        "dark:from-amber-900/10 dark:to-transparent"
      )}>
        <h3 className={cn(
          "text-lg font-semibold flex items-center space-x-2",
          "text-amber-700 dark:text-amber-300"
        )}>
          {isCredit ? (
            <>
              <CreditCard className="h-5 w-5 text-amber-500 dark:text-amber-400" strokeWidth={2} />
              <span>Contributions aux crédits</span>
            </>
          ) : (
            <>
              <ShoppingBag className="h-5 w-5 text-amber-500 dark:text-amber-400" strokeWidth={2} />
              <span>Contributions aux charges</span>
            </>
          )}
        </h3>
        <div className={cn(
          "px-3 py-1 rounded-full text-sm font-medium",
          "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
          "border border-amber-200/50 dark:border-amber-700/30"
        )}>
          {contributorPercentage}%
        </div>
      </div>

      {/* Liste des contributions */}
      <div className="px-5 py-3 divide-y divide-amber-100/50 dark:divide-gray-700/70">
        {expenses.length === 0 ? (
          <div className={cn(
            "py-8 text-center text-sm",
            "text-amber-600/70 dark:text-amber-400/70"
          )}>
            Aucune contribution pour le moment
          </div>
        ) : (
          expenses.map((item) => {
            const name = isCredit ? item.nom_credit : item.name;
            const category = isCredit ? item.nom_domaine : item.category;
            const amount = isCredit ? item.montant_mensualite : item.amount;
            const contributionAmount = (amount || 0) * (contributorPercentage / 100);

            return (
              <div
                key={item.id}
                className={cn(
                  "flex items-center justify-between py-3.5",
                  "transition hover:bg-amber-50/50 dark:hover:bg-amber-900/5",
                  "rounded-md -mx-1 px-1"
                )}
              >
                <div className="flex items-center space-x-3">
                  <div className={cn(
                    "p-2 rounded-md",
                    "bg-amber-100/60 text-amber-600 dark:bg-gray-700/70 dark:text-amber-400",
                    "flex items-center justify-center"
                  )}>
                    {isCredit ? (
                      <CreditCard className="h-4 w-4" />
                    ) : (
                      category?.toLowerCase().includes('logement') ||
                      category?.toLowerCase().includes('maison') ? (
                        <HomeIcon className="h-4 w-4" />
                      ) : (
                        <ShoppingBag className="h-4 w-4" />
                      )
                    )}
                  </div>
                  <div>
                    <p className={cn(
                      "font-medium",
                      "text-amber-800 dark:text-amber-300"
                    )}>
                      {name}
                    </p>
                    <p className="text-sm text-amber-600/60 dark:text-amber-400/60">
                      {category || 'Non catégorisé'}
                    </p>
                  </div>
                </div>
                <div className={cn(
                  "flex items-center space-x-1.5",
                  "px-3 py-1.5 rounded-md",
                  "bg-amber-50 dark:bg-amber-900/10",
                  "border border-amber-100 dark:border-amber-800/30",
                  "text-amber-700 dark:text-amber-400",
                  "font-medium"
                )}>
                  <Euro className="h-3 w-3" />
                  <span>
                    {contributionAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={cn(
          "border-t border-amber-100/70 dark:border-amber-800/30",
          "p-4 flex justify-center"
        )}>
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            className={cn(
              "pagination-amber",
              "[&_.pagination-button]:text-amber-600 [&_.pagination-button]:dark:text-amber-400",
              "[&_.pagination-button.active]:bg-amber-100 [&_.pagination-button.active]:dark:bg-amber-900/30",
              "[&_.pagination-button]:hover:bg-amber-50 [&_.pagination-button]:dark:hover:bg-amber-900/20"
            )}
          />
        </div>
      )}
    </Card>
  );
}
