
import { DashboardPreferences } from "@/types/profile";
import { usePreferenceUpdater } from "./usePreferenceUpdater";
import { Profile } from "@/types/profile";

export const usePreferenceToggles = (profile: Profile | null | undefined) => {
  const { handleToggle } = usePreferenceUpdater(profile);
  
  // Gestionnaires pour chaque toggle
  const handleRevenueCardToggle = (checked: boolean) => {
    handleToggle('show_revenue_card', checked);
  };

  const handleExpensesCardToggle = (checked: boolean) => {
    handleToggle('show_expenses_card', checked);
  };

  const handleCreditsCardToggle = (checked: boolean) => {
    handleToggle('show_credits_card', checked);
  };

  const handleSavingsCardToggle = (checked: boolean) => {
    handleToggle('show_savings_card', checked);
  };

  const handleExpenseStatsToggle = (checked: boolean) => {
    handleToggle('show_expense_stats', checked);
  };

  const handleChartsToggle = (checked: boolean) => {
    handleToggle('show_charts', checked);
  };

  const handleContributorsToggle = (checked: boolean) => {
    handleToggle('show_contributors', checked);
  };

  return {
    handleRevenueCardToggle,
    handleExpensesCardToggle,
    handleCreditsCardToggle,
    handleSavingsCardToggle,
    handleExpenseStatsToggle,
    handleChartsToggle,
    handleContributorsToggle
  };
};
