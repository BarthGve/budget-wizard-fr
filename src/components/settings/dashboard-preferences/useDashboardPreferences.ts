
import { useState } from "react";
import { Profile } from "@/types/profile";
import { usePreferenceUpdater } from "@/hooks/settings/usePreferenceUpdater";
import { usePreferenceToggles } from "@/hooks/settings/usePreferenceToggles";
import { getInitialPreferenceState, isDashboardPreferences, defaultPreferencesValues } from "@/utils/dashboard-preference-utils";

export const useDashboardPreferences = (profile: Profile | null | undefined) => {
  // Récupérer les préférences du profil ou utiliser les valeurs par défaut
  let profilePreferences;
  
  try {
    profilePreferences = profile?.dashboard_preferences && 
      isDashboardPreferences(profile.dashboard_preferences) ? 
      Object.assign({}, defaultPreferencesValues, profile.dashboard_preferences) : 
      defaultPreferencesValues;
  } catch (error) {
    console.error("Erreur lors de l'accès aux préférences:", error);
    profilePreferences = defaultPreferencesValues;
  }
    
  // Initialiser les états avec les valeurs du profil ou les valeurs par défaut
  const [showRevenueCard, setShowRevenueCard] = useState<boolean>(
    getInitialPreferenceState(profilePreferences, 'show_revenue_card')
  );
  const [showExpensesCard, setShowExpensesCard] = useState<boolean>(
    getInitialPreferenceState(profilePreferences, 'show_expenses_card')
  );
  const [showCreditsCard, setShowCreditsCard] = useState<boolean>(
    getInitialPreferenceState(profilePreferences, 'show_credits_card')
  );
  const [showSavingsCard, setShowSavingsCard] = useState<boolean>(
    getInitialPreferenceState(profilePreferences, 'show_savings_card')
  );
  const [showExpenseStats, setShowExpenseStats] = useState<boolean>(
    getInitialPreferenceState(profilePreferences, 'show_expense_stats')
  );
  const [showCharts, setShowCharts] = useState<boolean>(
    getInitialPreferenceState(profilePreferences, 'show_charts')
  );
  const [showContributors, setShowContributors] = useState<boolean>(
    getInitialPreferenceState(profilePreferences, 'show_contributors')
  );
  
  const { isUpdating } = usePreferenceUpdater(profile);
  const toggleHandlers = usePreferenceToggles(profile);

  return {
    showRevenueCard,
    showExpensesCard,
    showCreditsCard,
    showSavingsCard,
    showExpenseStats,
    showCharts,
    showContributors,
    isUpdating,
    ...toggleHandlers
  };
};
