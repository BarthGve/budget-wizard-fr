
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { BugOff, CheckCircle2, Edit, Share2, Sparkles, ThumbsUp, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface ChangelogEntry {
  id: string;
  title: string;
  description: string;
  type: "new" | "improvement" | "bugfix";
  date: string;
  version: string;
}

interface ChangelogTimelineProps {
  entries: ChangelogEntry[];
  isAdmin?: boolean;
  onEdit?: (entry: ChangelogEntry) => void;
  onDelete?: (entryId: string) => void;
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
      return "text-blue-500 dark:text-blue-400 border-blue-500/20";
    case "improvement":
      return "text-green-500 dark:text-green-400 border-green-500/20";
    case "bugfix":
      return "text-orange-500 dark:text-orange-400 border-orange-500/20";
  }
};

const getEntryTypeBadgeColor = (type: ChangelogEntry["type"]) => {
  switch (type) {
    case "new":
      return "bg-blue-500/10 text-blue-500 dark:text-blue-400 border-blue-500/20";
    case "improvement":
      return "bg-green-500/10 text-green-500 dark:text-green-400 border-green-500/20";
    case "bugfix":
      return "bg-orange-500/10 text-orange-500 dark:text-orange-400 border-orange-500/20";
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

export const ChangelogTimeline = ({ entries, isAdmin, onEdit, onDelete }: ChangelogTimelineProps) => {
  const [likedEntries, setLikedEntries] = useState<Record<string, boolean>>({});
  
  const toggleLike = (entryId: string) => {
    setLikedEntries(prev => ({
      ...prev,
      [entryId]: !prev[entryId]
    }));
  };
  
  const shareEntry = (entry: ChangelogEntry) => {
    if (navigator.share) {
      navigator.share({
        title: `${entry.title} - Version ${entry.version}`,
        text: `Découvrez la mise à jour : ${entry.title}`,
        url: window.location.href,
      }).catch(err => console.log('Erreur de partage:', err));
    } else {
      // Fallback - copie l'URL dans le presse-papier
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('URL copiée dans le presse-papier'))
        .catch(err => console.error('Erreur lors de la copie:', err));
    }
  };

  // Variants for motion animations
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="relative"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Modification ici: nous allons créer des segments de ligne qui s'arrêtent avant chaque carte */}
      {entries.map((_, index) => (
        <div 
          key={`line-${index}`} 
          className={cn(
            "absolute left-8 md:left-[4.5rem] w-px bg-border",
            index === 0 ? "top-0" : "",
            index === entries.length - 1 ? "bottom-0" : ""
          )}
          style={{
            top: index === 0 ? 0 : `calc(${index * 100}% / ${entries.length} - 2rem)`,
            bottom: index === entries.length - 1 ? 0 : `calc(${(entries.length - index - 1) * 100}% / ${entries.length} + 2rem)`,
            // Chaque segment va de la fin d'une carte au début de la suivante
            height: index === entries.length - 1 ? '2rem' : 'calc(4rem)'
          }}
        />
      ))}
      
      <div className="space-y-16">
        {entries.map((entry, index) => (
          <motion.div 
            key={entry.id} 
            className="relative"
            variants={item}
            transition={{ duration: 0.5 }}
          >
            <Card className="border bg-card/50 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden z-10 relative">
              <CardContent className="p-0">
                <div className="grid grid-cols-[auto,1fr] gap-6 p-6">
                  <div className={cn(
                    "w-16 h-16 rounded-full flex items-center justify-center border-2 relative z-20",
                    getEntryTypeColor(entry.type)
                  )}>
                    {getEntryTypeIcon(entry.type)}
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-semibold">{entry.title}</h3>
                          <Badge variant="outline" className={cn(getEntryTypeBadgeColor(entry.type))}>
                            {getEntryTypeLabel(entry.type)}
                          </Badge>
                          <Badge variant="secondary" className="bg-primary/10 dark:bg-primary/20 text-primary">
                            v{entry.version}
                          </Badge>
                        </div>
                        
                        <time className="text-sm text-muted-foreground">
                          {format(new Date(entry.date), "d MMMM yyyy", { locale: fr })}
                        </time>
                      </div>
                    </div>
                    
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown>{entry.description}</ReactMarkdown>
                    </div>
                    
                    <div className="flex justify-between pt-4 border-t border-border/40 flex-wrap gap-2">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleLike(entry.id)}
                          className={cn(
                            "text-muted-foreground hover:text-foreground",
                            likedEntries[entry.id] && "text-primary hover:text-primary"
                          )}
                        >
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          {likedEntries[entry.id] ? "Merci!" : "Utile"}
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground hover:text-foreground"
                          onClick={() => shareEntry(entry)}
                        >
                          <Share2 className="h-4 w-4 mr-1" />
                          Partager
                        </Button>
                      </div>
                      
                      {isAdmin && (
                        <div className="flex gap-2 ml-auto">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit?.(entry)}
                            className="hover:bg-muted"
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only md:not-sr-only md:ml-2">Modifier</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete?.(entry.id)}
                            className="text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only md:not-sr-only md:ml-2">Supprimer</span>
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
