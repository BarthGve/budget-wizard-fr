import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useTheme } from "next-themes";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { Contributor } from "@/types/contributor";
import { ContributorStatsChart } from "./contributor-details/ContributorStatsChart";
import { ContributorMonthlyDetails } from "./contributor-details/ContributorMonthlyDetails";
import { ContributorDetailsHeader } from "./contributor-details/ContributorDetailsHeader";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface ContributorDetailsDialogProps {
  contributor: Contributor;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ITEMS_PER_PAGE = 5;

export function ContributorDetailsDialog({ 
  contributor, 
  open, 
  onOpenChange 
}: ContributorDetailsDialogProps) {
  const { theme } = useTheme();
  const isDarkTheme = theme === "dark";
  const [currentExpensePage, setCurrentExpensePage] = useState(1);
  const [currentCreditPage, setCurrentCreditPage] = useState(1);
  const [isAnimating, setIsAnimating] = useState(true);

  // Réinitialiser l'animation et les pages quand la modale s'ouvre
  useEffect(() => {
    if (open) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 800);
      setCurrentExpensePage(1);
      setCurrentCreditPage(1);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile-avatar-details", contributor.is_owner],
    enabled: contributor.is_owner && open,
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data } = await supabase
        .from("profiles")
        .select("avatar_url")
        .eq("id", user.id)
        .single();

      return data;
    },
  });

  // Fetch monthly expenses and credits when modal is open
  const { data: monthlyData, isLoading: dataLoading } = useQuery({
    queryKey: ["contributor-monthly-data", contributor.name],
    enabled: open,
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const [{ data: expenses }, { data: credits }] = await Promise.all([
        supabase
          .from("recurring_expenses")
          .select("*")
          .eq("profile_id", user.id),
        supabase
          .from("credits")
          .select("*")
          .eq("profile_id", user.id)
          .eq("statut", "actif")
      ]);

      return {
        expenses: expenses || [],
        credits: credits || []
      };
    },
  });

  const isLoading = profileLoading || dataLoading || isAnimating;

  const paginatedData = monthlyData ? {
    expenses: monthlyData.expenses.slice(
      (currentExpensePage - 1) * ITEMS_PER_PAGE,
      currentExpensePage * ITEMS_PER_PAGE
    ),
    credits: monthlyData.credits.slice(
      (currentCreditPage - 1) * ITEMS_PER_PAGE,
      currentCreditPage * ITEMS_PER_PAGE
    )
  } : null;

  const totalPages = {
    expenses: monthlyData ? Math.max(1, Math.ceil(monthlyData.expenses.length / ITEMS_PER_PAGE)) : 1,
    credits: monthlyData ? Math.max(1, Math.ceil(monthlyData.credits.length / ITEMS_PER_PAGE)) : 1
  };

  // Calculer les montants totaux pour afficher dans le graphique
  const totalExpenseAmount = monthlyData?.expenses.reduce((sum, item) => sum + (item.amount || 0), 0) || 0;
  const totalCreditAmount = monthlyData?.credits.reduce((sum, item) => sum + (item.montant_mensualite || 0), 0) || 0;
  
  // Calculer les parts du contributeur
  const expenseShare = totalExpenseAmount * (contributor.percentage_contribution / 100);
  const creditShare = totalCreditAmount * (contributor.percentage_contribution / 100);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className={cn(
          "max-w-4xl w-[95vw] md:w-[950px]",
          "p-0 overflow-hidden",
          "bg-gradient-to-b from-amber-50/20 to-white dark:from-gray-900/30 dark:to-gray-800",
          "border border-amber-100/70 dark:border-amber-800/30"
        )}
      >
        <div className="pb-0 px-6 pt-6">
          <ContributorDetailsHeader
            name={contributor.name}
            isOwner={contributor.is_owner}
            avatarUrl={profile?.avatar_url}
            isDarkTheme={isDarkTheme}
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-[400px] animate-pulse">
            <Loader2 className="h-12 w-12 animate-spin text-amber-500/50 dark:text-amber-400/50" />
          </div>
        ) : (
          <div className={cn(
            "p-6 pt-2 space-y-4",
            "animate-in fade-in duration-500"
          )}>
            {/* Première rangée: Chart */}
            <div className={cn(
              "p-4 rounded-xl",
              "bg-white/70 dark:bg-gray-800/50",
              "border border-amber-100/50 dark:border-amber-800/20",
              "shadow-sm"
            )}>
              <h3 className={cn(
                "text-base font-semibold mb-2",
                "text-amber-700 dark:text-amber-300",
                "border-b border-amber-100/70 dark:border-amber-800/30",
                "pb-2"
              )}>
                Répartition des contributions
              </h3>
              <div className="h-[180px] flex justify-center items-center">
                <ContributorStatsChart
                  expenseShare={expenseShare}
                  creditShare={creditShare}
                  expenseAmount={totalExpenseAmount}
                  creditAmount={totalCreditAmount}
                />
              </div>
            </div>
            
            {/* Deuxième rangée: Détails */}
            {paginatedData && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ContributorMonthlyDetails
                  expenses={paginatedData.expenses}
                  currentPage={currentExpensePage}
                  totalPages={totalPages.expenses}
                  contributorPercentage={contributor.percentage_contribution}
                  onPageChange={setCurrentExpensePage}
                />
                <ContributorMonthlyDetails
                  expenses={paginatedData.credits}
                  currentPage={currentCreditPage}
                  totalPages={totalPages.credits}
                  contributorPercentage={contributor.percentage_contribution}
                  onPageChange={setCurrentCreditPage}
                  type="credit"
                />
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
