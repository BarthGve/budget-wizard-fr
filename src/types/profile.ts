
export type ProfileType = 'basic' | 'pro';

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  color_palette: string | null;
  savings_goal_percentage: number | null;
  updated_at: string | null;
  email?: string | null; // Rendu optionnel avec '?'
  profile_type: ProfileType;
  encryption_enabled: boolean | null;
  notif_inscriptions?: boolean;
  notif_changelog?: boolean;
  notif_feedbacks?: boolean;
}
