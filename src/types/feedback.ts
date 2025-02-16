
export interface Feedback {
  id: string;
  title: string;
  content: string;
  rating: number;
  status: "pending" | "in_progress" | "completed";
  created_at: string;
  profile: {
    full_name: string | null;
    avatar_url: string | null;
  };
}
