
import { BugOff, CheckCircle2, Sparkles } from "lucide-react";

type EntryType = "new" | "improvement" | "bugfix";

interface ChangelogEntryIconProps {
  type: EntryType;
  className?: string;
}

export const getEntryTypeIcon = (type: EntryType) => {
  switch (type) {
    case "new":
      return <Sparkles className="w-5 h-5" />;
    case "improvement":
      return <CheckCircle2 className="w-5 h-5" />;
    case "bugfix":
      return <BugOff className="w-5 h-5" />;
  }
};

export const getEntryTypeColor = (type: EntryType) => {
  switch (type) {
    case "new":
      return "text-blue-500 bg-blue-500/5 border-blue-500/10";
    case "improvement":
      return "text-green-500 bg-green-500/5 border-green-500/10";
    case "bugfix":
      return "text-orange-500 bg-orange-500/5 border-orange-500/10";
  }
};

export const ChangelogEntryIcon = ({ type, className }: ChangelogEntryIconProps) => {
  return (
    <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-card border ${className}`}>
      {getEntryTypeIcon(type)}
    </div>
  );
};
