
import { CardContent } from "@/components/ui/card";
import { Contributor } from "@/types/contributor";
import { ContributorsTableList } from "./ContributorsTableList";

interface ContributorsTableContentProps {
  contributors: Array<Contributor>;
  totalExpenses: number;
  totalCredits: number;
  isDarkTheme: boolean;
  avatarUrl?: string | null;
  onSelectContributor: (contributor: Contributor) => void;
}

export function ContributorsTableContent({
  contributors,
  totalExpenses,
  totalCredits,
  isDarkTheme,
  avatarUrl,
  onSelectContributor,
}: ContributorsTableContentProps) {
  return (
    <CardContent>
      <ContributorsTableList
        contributors={contributors}
        totalExpenses={totalExpenses}
        totalCredits={totalCredits}
        isDarkTheme={isDarkTheme}
        avatarUrl={avatarUrl}
        onSelectContributor={onSelectContributor}
      />
    </CardContent>
  );
}
