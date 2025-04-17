
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import { ChangelogEntry as ChangelogEntryType } from "../types";
import { ChangelogEntryIcon, getEntryTypeColor } from "./ChangelogEntryIcon";
import { ChangelogEntryTypeBadge } from "./ChangelogEntryTypeBadge";
import { ChangelogEntryActions } from "./ChangelogEntryActions";

interface ChangelogEntryProps {
  entry: ChangelogEntryType;
  isAdmin: boolean;
  onEdit: (entry: ChangelogEntryType) => void;
  onDelete: (entryId: string) => void;
}

export const ChangelogEntryCard = ({ 
  entry, 
  isAdmin,
  onEdit,
  onDelete
}: ChangelogEntryProps) => {
  return (
    <Card
      className={cn(
        "relative animate-fade-up border overflow-hidden", 
        getEntryTypeColor(entry.type),
        !entry.is_visible && "border-dashed opacity-70"
      )}
    >
      <div className="p-6">
        <div className="flex items-start gap-2 flex-wrap">
          <div className={cn(
            "absolute left-0 top-0 bottom-0 w-1.5",
            entry.type === "new" ? "bg-blue-500" : 
            entry.type === "improvement" ? "bg-green-500" : "bg-orange-500"
          )} />
              
          <ChangelogEntryIcon type={entry.type} />
            
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="text-lg font-semibold">{entry.title}</h3>
              <ChangelogEntryTypeBadge type={entry.type} />
              <Badge variant="outline" className="text-xs">
                v{entry.version}
              </Badge>
              {isAdmin && !entry.is_visible && (
                <Badge variant="outline" className="text-amber-500 border-amber-500/20 bg-amber-500/10">
                  <EyeOff className="w-3 h-3 mr-1" />
                  Caché
                </Badge>
              )}
            </div>
            <time className="text-sm text-muted-foreground block mb-4">
              {format(new Date(entry.date), "d MMMM yyyy", { locale: fr })}
            </time>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown>{entry.description}</ReactMarkdown>
            </div>
          </div>
            
          {isAdmin && (
            <ChangelogEntryActions 
              entry={entry}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          )}
        </div>
      </div>
    </Card>
  );
};
