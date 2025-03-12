import { Card } from "@/components/ui/card";
import { PaginationControls } from "@/components/properties/expenses/PaginationControls";
import { Euro, CreditCard, HomeIcon, ShoppingBag, Tag } from "lucide-react";
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
  
  // Formater le pourcentage avec exactement 2 décimales et virgule comme séparateur décimal
  const formattedPercentage = contributorPercentage.toFixed(2).replace('.', ',');

  // Fonction helper pour formater les nombres avec virgule
  const formatNumber = (value: number) => value.toFixed(2).replace('.', ',');

  const getCategoryIcon = (category?: string) => {
    if (isCredit) return <CreditCard className="h-4 w-4" />;
    
    if (!category) return <Tag className="h-4 w-4" />;
    
    const lowerCategory = category.toLowerCase();
    if (lowerCategory.includes('logement') || lowerCategory.includes('maison')) {
      return <HomeIcon className="h-4 w-4" />;
    }
    return <ShoppingBag className="h-4 w-4" />;
  };

  return (
    <Card className={cn(
      "overflow-hidden border-0 h-full",
      "shadow-sm",
      "bg-white dark:bg-gray-800",
      "ring-1 ring-amber-100/30 dark:ring-amber-700/10"
    )}>
      {/* En-tête stylisé */}
      <div className={cn(
        "px-4 py-3 flex items-center justify-between",
        "border-b border-amber-100/50 dark:border-amber-800/20",
        "bg-gradient-to-r from-amber-50/70 to-transparent",
        "dark:from-amber-900/5 dark:to-transparent"
      )}>
        <h3 className={cn(
          "text-base font-semibold flex items-center space-x-2",
          "text-amber-700 dark:text-amber-300"
        )}>
          {isCredit ? (
            <>
              <CreditCard className="h-4 w-4 text-amber-500 dark:text-amber-400" strokeWidth={2} />
              <span>Crédits ({expenses.length})</span>
            </>
          ) : (
            <>
              <ShoppingBag className="h-4 w-4 text-amber-500 dark:text-amber-400" strokeWidth={2} />
              <span>Charges ({expenses.length})</span>
            </>
          )}
        </h3>
        <div className={cn(
          "px-2 py-1 rounded-full text-xs font-medium",
          "bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
          "border border-amber-200/50 dark:border-amber-700/20"
        )}>
          {formattedPercentage}%
        </div>
      </div>

      {/* Liste des contributions */}
      <div className={cn(
        "px-4 pt-2 pb-3", 
        expenses.length > 0 ? "divide-y divide-amber-100/40 dark:divide-gray-700/50" : ""
      )}>
        {expenses.length === 0 ? (
          <div className={cn(
            "py-8 text-center text-sm",
            "text-amber-600/60 dark:text-amber-400/60"
          )}>
            Aucun{isCredit ? " crédit" : "e charge"} pour ce mois
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
                  "flex items-center justify-between py-3",
                  "transition hover:bg-amber-50/30 dark:hover:bg-amber-900/5"
                )}
              >
                <div className="flex items-center space-x-2.5">
                  <div className={cn(
                    "p-1.5 rounded-md",
                    "bg-amber-100/50 text-amber-600 dark:bg-gray-700/50 dark:text-amber-400",
                    "flex items-center justify-center"
                  )}>
                    {getCategoryIcon(category)}
                  </div>
                  <div>
                    <p className={cn(
                      "font-medium text-sm",
                      "text-amber-800 dark:text-amber-300"
                    )}>
                      {name || 'Sans nom'}
                    </p>
                    <p className="text-xs text-amber-600/60 dark:text-amber-400/60">
                      {category || 'Non catégorisé'}
                    </p>
                  </div>
                </div>
                <div className={cn(
                  "flex items-center space-x-1",
                  "px-2 py-1 rounded-md",
                  "bg-amber-50 dark:bg-amber-900/10",
                  "border border-amber-100 dark:border-amber-800/30",
                  "text-amber-700 dark:text-amber-400",
                  "text-xs font-medium"
                )}>
                  <Euro className="h-3 w-3" />
                  <span>
                    {formatNumber(contributionAmount)}
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
          "border-t border-amber-100/50 dark:border-amber-800/20",
          "p-3 flex justify-center"
        )}>
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            className={cn(
              "pagination-amber scale-90 transform",
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
