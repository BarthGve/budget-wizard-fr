
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
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch profile avatar if the contributor is the owner
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

      const { data: expenses } = await supabase
        .from("recurring_expenses")
        .select("*")
        .eq("profile_id", user.id);

      return {
        expenses: expenses || [],
      };
    },
  });

  const paginatedData = monthlyData ? {
    expenses: monthlyData.expenses.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    ),
  } : null;

  const totalPages = monthlyData 
    ? Math.ceil(monthlyData.expenses.length / ITEMS_PER_PAGE)
    : 1;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg w-[500px]">
        <DialogHeader>
          <ContributorDetailsHeader
            name={contributor.name}
            isOwner={contributor.is_owner}
            avatarUrl={profile?.avatar_url}
            isDarkTheme={isDarkTheme}
          />
        </DialogHeader>

        <div className="mt-6 space-y-6">
          <ContributorStatsChart
            expenseShare={contributor.expenseShare || 0}
            creditShare={contributor.creditShare || 0}
          />

          {paginatedData && (
            <ContributorMonthlyDetails
              expenses={paginatedData.expenses}
              currentPage={currentPage}
              totalPages={totalPages}
              contributorPercentage={contributor.percentage_contribution}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
