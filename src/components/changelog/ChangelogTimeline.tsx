
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { BugOff, CheckCircle2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChangelogEntry {
  id: string;
  title: string;
  description: string;
  type: "new" | "improvement" | "bugfix";
  date: string;
}

interface ChangelogTimelineProps {
  entries: ChangelogEntry[];
}

const getEntryTypeIcon = (type: ChangelogEntry["type"]) => {
  switch (type) {
    case "new":
      return <Sparkles className="w-5 h-5" />;
    case "improvement":
      return <CheckCircle2 className="w-5 h-5" />;
    case "bugfix":
      return <BugOff className="w-5 h-5" />;
  }
};

const getEntryTypeColor = (type: ChangelogEntry["type"]) => {
  switch (type) {
    case "new":
      return "text-blue-500 dark:text-blue-400";
    case "improvement":
      return "text-green-500 dark:text-green-400";
    case "bugfix":
      return "text-orange-500 dark:text-orange-400";
  }
};

const getEntryTypeBadgeColor = (type: ChangelogEntry["type"]) => {
  switch (type) {
    case "new":
      return "bg-blue-500/10 text-blue-500 dark:text-blue-400";
    case "improvement":
      return "bg-green-500/10 text-green-500 dark:text-green-400";
    case "bugfix":
      return "bg-orange-500/10 text-orange-500 dark:text-orange-400";
  }
};

const getEntryTypeLabel = (type: ChangelogEntry["type"]) => {
  switch (type) {
    case "new":
      return "Nouveau";
    case "improvement":
      return "Amélioration";
    case "bugfix":
      return "Correction";
  }
};

export const ChangelogTimeline = ({ entries }: ChangelogTimelineProps) => {
  return (
    <div className="relative">
      <div className="absolute left-8 top-3 bottom-3 w-px bg-border"></div>
      <div className="space-y-8">
        {entries.map((entry) => (
          <div key={entry.id} className="relative grid grid-cols-[auto,1fr] gap-6">
            <div className={cn("w-16 h-16 rounded-full bg-card flex items-center justify-center border", getEntryTypeColor(entry.type))}>
              {getEntryTypeIcon(entry.type)}
            </div>
            <div className="space-y-2">
              <div className="flex items-start gap-2 flex-wrap">
                <h3 className="text-lg font-semibold">{entry.title}</h3>
                <span className={cn("px-2 py-0.5 text-xs rounded-full font-medium", getEntryTypeBadgeColor(entry.type))}>
                  {getEntryTypeLabel(entry.type)}
                </span>
                <time className="text-sm text-muted-foreground">
                  {format(new Date(entry.date), "d MMMM yyyy", { locale: fr })}
                </time>
              </div>
              <p className="text-muted-foreground">{entry.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
