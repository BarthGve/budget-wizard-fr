
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { useTheme } from "next-themes";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Contributor } from "@/types/contributor";
import { ContributorStatsChart } from "./contributor-details/ContributorStatsChart";
import { ContributorMonthlyDetails } from "./contributor-details/ContributorMonthlyDetails";
import { ContributorDetailsHeader } from "./contributor-details/ContributorDetailsHeader";

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

  const { data: profile } = useQuery({
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
  const { data: monthlyData } = useQuery({
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
    expenses: monthlyData ? Math.ceil(monthlyData.expenses.length / ITEMS_PER_PAGE) : 1,
    credits: monthlyData ? Math.ceil(monthlyData.credits.length / ITEMS_PER_PAGE) : 1
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-5xl w-[1000px]">
      <DialogHeader>
        <ContributorDetailsHeader
          name={contributor.name}
          isOwner={contributor.is_owner}
          avatarUrl={profile?.avatar_url}
          isDarkTheme={isDarkTheme}
        />
      </DialogHeader>
      <div className="mt-6 grid grid-cols-3 gap-6">
        {/* Graphique des statistiques */}
        <div className="col-span-1">
          <ContributorStatsChart
            expenseShare={contributor.expenseShare || 0}
            creditShare={contributor.creditShare || 0}
          />
        </div>
        {/* Détails mensuels, placés en grid pour une meilleure répartition */}
        {paginatedData && (
          <div className="col-span-2 grid grid-cols-2 gap-6">
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
    </DialogContent>
  </Dialog>
  );
}
