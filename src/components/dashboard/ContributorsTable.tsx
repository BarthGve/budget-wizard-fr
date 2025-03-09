import { Card } from "@/components/ui/card";
import { useState } from "react";
import { useTheme } from "next-themes";
import { ContributorDetailsDialog } from "./ContributorDetailsDialog";
import { Contributor } from "@/types/contributor";
import { useProfileAvatar } from "@/hooks/useProfileAvatar";
import { ContributorsTableHeader } from "./contributor-table/ContributorsTableHeader";
import { ContributorsTableContent } from "./contributor-table/ContributorsTableContent";
import { motion } from "framer-motion";
import { Users } from "lucide-react"; // Icône pour les contributeurs

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
        <Card className="bg-background shadow-md border border-gray-100 overflow-hidden">
          {/* En-tête stylisé avec titre et icône */}
          <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex items-center gap-2">
            <Users className="h-5 w-5 text-gray-500" />
            <h3 className="text-lg font-medium">Contributeurs</h3>
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
