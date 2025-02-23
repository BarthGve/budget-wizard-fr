
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Contributor } from "@/types/contributor";
import { ContributorTableRow } from "./ContributorTableRow";

interface ContributorsTableListProps {
  contributors: Array<Contributor>;
  totalExpenses: number;
  totalCredits: number;
  isDarkTheme: boolean;
  avatarUrl?: string | null;
  onSelectContributor: (contributor: Contributor) => void;
}

export function ContributorsTableList({
  contributors,
  totalExpenses,
  totalCredits,
  isDarkTheme,
  avatarUrl,
  onSelectContributor,
}: ContributorsTableListProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Contributeur</TableHead>
            <TableHead className="text-right">Revenus mensuels</TableHead>
            <TableHead className="text-right">Part des revenus</TableHead>
            <TableHead className="text-right">Participation aux charges</TableHead>
            <TableHead className="text-right">Participation aux crédits</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contributors.map((contributor) => {
            const expenseShare = (totalExpenses * contributor.percentage_contribution) / 100;
            const creditShare = (totalCredits * contributor.percentage_contribution) / 100;
            
            return (
              <ContributorTableRow
                key={contributor.name}
                contributor={contributor}
                expenseShare={expenseShare}
                creditShare={creditShare}
                isDarkTheme={isDarkTheme}
                avatarUrl={avatarUrl}
                onSelect={onSelectContributor}
              />
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
