import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { BugOff, CheckCircle2, Edit, EyeOff, MoreHorizontal, Sparkles, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import { ChangelogEntry } from "./types";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { toggleChangelogVisibility } from "@/services/changelog";
import { toast } from "@/hooks/useToastWrapper";

interface ChangelogContentProps {
  entries: ChangelogEntry[];
  isLoading: boolean;
  isAdmin: boolean;
  onEdit: (entry: ChangelogEntry) => void;
  onDelete: (entryId: string) => void;
}

export const ChangelogContent = ({ 
  entries, 
  isLoading, 
  isAdmin,
  onEdit,
  onDelete 
}: ChangelogContentProps) => {
  const [updatingVisibility, setUpdatingVisibility] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="text-muted-foreground mb-2 text-6xl">📝</div>
        <h3 className="text-xl font-semibold mb-2">Aucune entrée de changelog</h3>
        <p className="text-muted-foreground max-w-sm">
          Il n'y a pas encore d'entrées dans le changelog ou aucune ne correspond à vos critères de recherche.
        </p>
      </div>
    );
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
        return "text-blue-500 bg-blue-500/5 border-blue-500/10";
      case "improvement":
        return "text-green-500 bg-green-500/5 border-green-500/10";
      case "bugfix":
        return "text-orange-500 bg-orange-500/5 border-orange-500/10";
    }
  };

  const getEntryTypeBadgeColor = (type: ChangelogEntry["type"]) => {
    switch (type) {
      case "new":
        return "bg-blue-500/10 text-blue-500";
      case "improvement":
        return "bg-green-500/10 text-green-500";
      case "bugfix":
        return "bg-orange-500/10 text-orange-500";
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

  const handleToggleVisibility = async (entryId: string, currentVisibility: boolean) => {
    try {
      setUpdatingVisibility(entryId);
      await toggleChangelogVisibility(entryId, !currentVisibility);
      toast(!currentVisibility 
        ? "Entrée rendue visible" 
        : "Entrée masquée"
      );
    } catch (error) {
      console.error("Erreur lors du changement de visibilité:", error);
      toast.error("Impossible de changer la visibilité de l'entrée");
    } finally {
      setUpdatingVisibility(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-8">
        {entries.map((entry) => (
          <Card
            key={entry.id}
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
                    
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-card border">
                  {getEntryTypeIcon(entry.type)}
                </div>
                  
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="text-lg font-semibold">{entry.title}</h3>
                    <Badge variant="outline" className={getEntryTypeBadgeColor(entry.type)}>
                      {getEntryTypeLabel(entry.type)}
                    </Badge>
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
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(entry)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleToggleVisibility(entry.id, entry.is_visible)}
                        disabled={updatingVisibility === entry.id}
                      >
                        {entry.is_visible ? (
                          <>
                            <EyeOff className="h-4 w-4 mr-2" />
                            Masquer
                          </>
                        ) : (
                          <>
                            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                            Rendre visible
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => onDelete(entry.id)}
                        className="text-destructive focus:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {entries.length > 0 && (
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};
