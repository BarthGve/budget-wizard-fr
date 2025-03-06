
export type ProfileType = "basic" | "pro";

export interface Profile {
  id: string;
  email?: string;
  username?: string;
  full_name?: string;
  avatar_url?: string | null;
  updated_at?: string;
  profile_type: ProfileType;
  notif_changelog?: boolean;
  notif_inscriptions?: boolean;
}
