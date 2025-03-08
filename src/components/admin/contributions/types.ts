
export type ContributionStatus = 'pending' | 'in_progress' | 'completed';

export interface Contribution {
  id: string;
  profile_id: string;
  title: string;
  content: string;
  type: string;
  status: ContributionStatus;
  created_at: string;
  updated_at: string;
  profiles?: {
    id: string;
    full_name: string;
    avatar_url: string;
  };
}
