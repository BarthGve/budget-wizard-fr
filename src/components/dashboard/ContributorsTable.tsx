
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { useTheme } from "next-themes";
import { ContributorDetailsDialog } from "./ContributorDetailsDialog";
import { Contributor } from "@/types/contributor";
import { useProfileAvatar } from "@/hooks/useProfileAvatar";
import { ContributorsTableHeader } from "./contributor-table/ContributorsTableHeader";
import { ContributorsTableContent } from "./contributor-table/ContributorsTableContent";
import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContributorsTableProps {
  contributors: Array<Contributor>;
  totalExpenses: number;
  totalCredits: number;
  onSelectContributor?: (contributor: Contributor) => void;
}

export const ContributorsTable = ({ 
  contributors, 
  totalExpenses,
  totalCredits,
  onSelectContributor
}: ContributorsTableProps) => {
  const { theme } = useTheme();
  const [selectedContributor, setSelectedContributor] = useState<Contributor | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data: profile } = useProfileAvatar();

  // Afficher le tableau même s'il n'y a qu'un seul contributeur
  if (!contributors || contributors.length === 0) return null;

  const isDarkTheme = theme === "dark";

  const handleSelectContributor = (contributor: Contributor) => {
    // Si un gestionnaire externe est fourni, l'utiliser
    if (onSelectContributor) {
      onSelectContributor(contributor);
    } else {
      // Sinon, utiliser le comportement par défaut
      setSelectedContributor(contributor);
      setDialogOpen(true);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className={cn(
          "overflow-hidden shadow-lg",
          // Light mode styling
          "bg-white border border-gray-100",
          // Dark mode styling
          "dark:bg-gray-900/95 dark:border-gray-800 dark:shadow-lg dark:shadow-gray-900/30"
        )}>
          {/* En-tête stylisé avec titre et icône - maintenant avec un fond jaune subtil */}
          <div className={cn(
            "px-4 py-3 border-b flex items-center gap-2",
            // Light mode styling avec fond jaune subtil dégradé
            "border-amber-100 bg-gradient-to-r from-amber-50/90 to-amber-50/60",
            // Dark mode styling avec fond jaune subtil plus sombre
            "dark:border-amber-900/20 dark:bg-gradient-to-r dark:from-amber-900/20 dark:to-amber-900/10"
          )}>
            <div className={cn(
              "p-1.5 rounded-full",
              // Light mode - fond légèrement teinté jaune
              "bg-amber-100/90",
              // Dark mode - fond ambré sombre
              "dark:bg-amber-800/30"
            )}>
              <Users className={cn(
                "h-4 w-4", 
                "text-amber-600/80", 
                "dark:text-amber-400/90"
              )} />
            </div>
            <h3 className={cn(
              "text-lg font-medium",
              "dark:text-white"
            )}>
              Contributeurs
            </h3>
          </div>
          
          <ContributorsTableHeader />
          <ContributorsTableContent
            contributors={contributors}
            totalExpenses={totalExpenses}
            totalCredits={totalCredits}
            isDarkTheme={isDarkTheme}
            avatarUrl={profile?.avatar_url}
            onSelectContributor={handleSelectContributor}
          />
        </Card>
      </motion.div>
      
      {selectedContributor && !onSelectContributor && (
        <ContributorDetailsDialog 
          contributor={selectedContributor}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      )}
    </>
  );
};
