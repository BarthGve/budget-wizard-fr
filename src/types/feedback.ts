
export interface Feedback {
  id: string;
  title: string;
  content: string;
  rating: number;
  status: "pending" | "read" | "published";
  created_at: string;
  profile: {
    full_name: string | null;
    avatar_url: string | null;
  };
}
