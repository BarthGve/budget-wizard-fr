export interface ChangelogEntry {
  id: string;
  title: string;
  description: string;
  type: "new" | "improvement" | "bugfix";
  version: string;
  date: string;
  is_visible: boolean;
}

export interface FormData {
  title: string;
  description: string;
  type: "new" | "improvement" | "bugfix";
  version: string;
  date: Date;
  isVisible?: boolean;
}
