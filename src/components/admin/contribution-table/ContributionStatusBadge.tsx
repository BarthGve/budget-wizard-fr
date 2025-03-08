
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ContributionStatusBadgeProps {
  status: "pending" | "in_progress" | "completed";
  className?: string;
}

export const ContributionStatusBadge = ({ status, className }: ContributionStatusBadgeProps) => {
  const statusConfig = {
    pending: {
      label: "À traiter",
      variant: "bg-yellow-50 text-yellow-700 border-yellow-200",
    },
    in_progress: {
      label: "En cours",
      variant: "bg-blue-50 text-blue-700 border-blue-200",
    },
    completed: {
      label: "Traité",
      variant: "bg-green-50 text-green-700 border-green-200",
    },
  };

  const config = statusConfig[status];

  return (
    <Badge className={cn("font-normal", config.variant, className)}>
      {config.label}
    </Badge>
  );
};
