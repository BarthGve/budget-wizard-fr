
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type EntryType = "new" | "improvement" | "bugfix";

interface ChangelogEntryTypeBadgeProps {
  type: EntryType;
}

export const getEntryTypeBadgeColor = (type: EntryType) => {
  switch (type) {
    case "new":
      return "bg-blue-500/10 text-blue-500";
    case "improvement":
      return "bg-green-500/10 text-green-500";
    case "bugfix":
      return "bg-orange-500/10 text-orange-500";
  }
};

export const getEntryTypeLabel = (type: EntryType) => {
  switch (type) {
    case "new":
      return "Nouveau";
    case "improvement":
      return "Amélioration";
    case "bugfix":
      return "Correction";
  }
};

export const ChangelogEntryTypeBadge = ({ type }: ChangelogEntryTypeBadgeProps) => {
  return (
    <Badge variant="outline" className={getEntryTypeBadgeColor(type)}>
      {getEntryTypeLabel(type)}
    </Badge>
  );
};
