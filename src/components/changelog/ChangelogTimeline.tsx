
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { BugOff, CheckCircle2, Copy, Edit, Sparkles, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

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
  // Fonction de partage améliorée compatible avec les iframe
  const shareEntry = (entry: ChangelogEntry) => {
    // Création du texte à partager
    const shareText = `${entry.title} - Version ${entry.version}\n\nDécouvrez la mise à jour : ${entry.title}`;
    const shareUrl = window.location.href;
    
    // Essayer d'utiliser l'API de partage native si disponible
    if (navigator.share) {
      navigator.share({
        title: `${entry.title} - Version ${entry.version}`,
        text: `Découvrez la mise à jour : ${entry.title}`,
        url: shareUrl,
      }).catch(err => {
        console.log('Erreur de partage:', err);
        // Fallback en cas d'erreur avec l'API de partage
        copyToClipboard(shareText + "\n\n" + shareUrl);
      });
    } else {
      // Fallback pour les navigateurs qui ne supportent pas l'API Share
      copyToClipboard(shareText + "\n\n" + shareUrl);
    }
  };
  
  // Fonction pour copier dans le presse-papier
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast.success("Lien copié dans le presse-papier", {
          description: "Vous pouvez maintenant le partager où vous voulez",
          position: "bottom-center",
        });
      })
      .catch(err => {
        console.error('Erreur lors de la copie:', err);
        // Fallback en cas d'échec de l'API clipboard
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        
        try {
          const successful = document.execCommand('copy');
          if (successful) {
            toast.success("Lien copié dans le presse-papier");
          } else {
            toast.error("Impossible de copier le lien");
          }
        } catch (err) {
          toast.error("Impossible de copier le lien");
        }
        
        document.body.removeChild(textarea);
      });
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
      {/* Nouvelle approche: pas de ligne continue, mais des points connectés par des segments courts */}
      <div className="space-y-16">
        {entries.map((entry, index) => (
          <motion.div 
            key={entry.id} 
            className="cl-changelog-entry-container"
            variants={item}
            transition={{ duration: 0.5 }}
          >
            {/* Point de timeline */}
            <div className="absolute left-8 md:left-[4.5rem] h-full flex flex-col items-center">
              {/* Point indicateur avec couleur selon le type */}
              <div className={cn(
                "w-3 h-3 rounded-full z-10",
                entry.type === "new" ? "bg-blue-500" : 
                entry.type === "improvement" ? "bg-green-500" : 
                "bg-orange-500"
              )} />
              
              {/* Ligne de connexion (uniquement si pas le dernier élément) */}
              {index < entries.length - 1 && (
                <div className="w-px bg-border flex-1 my-2" />
              )}
            </div>
            
            {/* Card du changelog */}
            <div className="pl-16 md:pl-24">
              <Card className="cl-timeline-card">
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
                            className="text-muted-foreground hover:text-foreground"
                            onClick={() => shareEntry(entry)}
                          >
                            <Copy className="h-4 w-4 mr-1" />
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
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
