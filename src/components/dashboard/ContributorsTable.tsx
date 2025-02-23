
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useTheme } from "next-themes";
import { ContributorDetailsDialog } from "./ContributorDetailsDialog";
import { Contributor } from "@/types/contributor";
import { ContributorsTableList } from "./contributor-table/ContributorsTableList";
import { useProfileAvatar } from "@/hooks/useProfileAvatar";

interface ContributorsTableProps {
  contributors: Array<{
    id: string;
    name: string;
    total_contribution: number;
    percentage_contribution: number;
    is_owner?: boolean;
    profile_id: string;
  }>;
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

  if (contributors.length <= 1) return null;

  const isDarkTheme = theme === "dark";

  const handleSelectContributor = (contributor: Contributor) => {
    setSelectedContributor(contributor);
    setDialogOpen(true);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Répartition des charges</CardTitle>
          <CardDescription>Détail des revenus et participations par contributeur</CardDescription>
        </CardHeader>
        <CardContent>
          <ContributorsTableList
            contributors={contributors}
            totalExpenses={totalExpenses}
            totalCredits={totalCredits}
            isDarkTheme={isDarkTheme}
            avatarUrl={profile?.avatar_url}
            onSelectContributor={handleSelectContributor}
          />
        </CardContent>
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
