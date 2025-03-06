
// Types partagés pour la fonction notify-changelog

export interface ChangelogEntry {
  id: string;
  title: string;
  description: string;
  version: string;
  date: string;
  type: "new" | "improvement" | "bugfix" | string;
}

export interface RequestPayload {
  id: string;
  manual: boolean;
}

export interface EmailBadge {
  badgeText: string;
  badgeColor: string;
}

export interface SupabaseErrorResponse {
  error: any;
  message?: string;
  context?: any;
}
