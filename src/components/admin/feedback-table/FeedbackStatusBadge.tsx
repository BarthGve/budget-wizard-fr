
import { cn } from "@/lib/utils";

interface FeedbackStatusBadgeProps {
  status: "pending" | "read" | "published";
}

export const FeedbackStatusBadge = ({ status }: FeedbackStatusBadgeProps) => {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        {
          "bg-yellow-100 text-yellow-800": status === "pending",
          "bg-blue-100 text-blue-800": status === "read",
          "bg-green-100 text-green-800": status === "published",
        }
      )}
    >
      {status === "pending" && "En attente"}
      {status === "read" && "Lu"}
      {status === "published" && "Publié"}
    </div>
  );
};
