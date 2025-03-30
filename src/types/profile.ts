
export type ProfileType = 'basic' | 'pro';

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  color_palette: string | null;
  savings_goal_percentage: number | null;
  updated_at: string | null;
  email?: string | null;
  profile_type: ProfileType;
  encryption_enabled: boolean | null;
  notif_inscriptions?: boolean;
  notif_changelog?: boolean;
  notif_feedbacks?: boolean;
  onboarding_completed?: boolean;
  dashboard_preferences?: DashboardPreferences;
}

export interface DashboardPreferences {
  show_revenue_card?: boolean;
  show_expenses_card?: boolean;
  show_credits_card?: boolean;
  show_savings_card?: boolean;
  show_expense_stats?: boolean;
  show_charts?: boolean;
  show_contributors?: boolean;
}
