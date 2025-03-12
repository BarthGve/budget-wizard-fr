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
}

export const ContributorsTable = ({ 
  contributors, 
  totalExpenses,
  totalCredits 
}: ContributorsTableProps) => {
  const { theme } = useTheme();
  const [selectedContributor, setSelectedContributor] = useState<Contributor | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data: profile } = useProfileAvatar();

  // Afficher le tableau même s'il n'y a qu'un seul contributeur
  if (!contributors || contributors.length === 0) return null;

  const isDarkTheme = theme === "dark";

  const handleSelectContributor = (contributor: Contributor) => {
    setSelectedContributor(contributor);
    setDialogOpen(true);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className={cn(
          "overflow-hidden shadow-md",
          // Light mode styling
          "bg-white border border-gray-100",
          // Dark mode styling
          "dark:bg-gray-900/95 dark:border-gray-800 dark:shadow-lg dark:shadow-gray-900/30"
        )}>
          {/* En-tête stylisé avec titre et icône */}
          <div className={cn(
            "px-4 py-3 border-b flex items-center gap-2",
            // Light mode styling
            "border-gray-100 bg-gradient-to-r from-gray-50 to-white",
            // Dark mode styling
            "dark:border-gray-800/80 dark:bg-gradient-to-r dark:from-gray-900/95 dark:to-gray-850/90"
          )}>
            <div className={cn(
              "p-1.5 rounded-full",
              // Light mode
              "bg-gray-100",
              // Dark mode
              "dark:bg-gray-800"
            )}>
              <Users className={cn(
                "h-4 w-4", 
                "text-gray-500", 
                "dark:text-gray-300"
              )} />
            </div>
            <h3 className={cn(
              "text-lg font-medium",
              "text-gray-800",
              "dark:text-gray-200"
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
      
      {selectedContributor && (
        <ContributorDetailsDialog 
          contributor={selectedContributor}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      )}
    </>
  );
};
