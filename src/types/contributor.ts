
export interface Contributor {
  id: string;
  name: string;
  email?: string;
  total_contribution: number;
  percentage_contribution: number;
  is_owner: boolean;
  profile_id: string;
  expenseShare?: number;
  creditShare?: number;
}

export interface NewContributor {
  name: string;
  email?: string;
  total_contribution: string;
}
