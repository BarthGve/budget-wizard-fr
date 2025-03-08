
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { useTheme } from "next-themes";
import { ContributorDetailsDialog } from "./ContributorDetailsDialog";
import { Contributor } from "@/types/contributor";
import { useProfileAvatar } from "@/hooks/useProfileAvatar";
import { ContributorsTableHeader } from "./contributor-table/ContributorsTableHeader";
import { ContributorsTableContent } from "./contributor-table/ContributorsTableContent";

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
      <Card>
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
