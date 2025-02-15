
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ContributorsTableProps {
  contributors: Array<{
    name: string;
    total_contribution: number;
    percentage_contribution: number;
  }>;
  totalExpenses: number;
}

export const ContributorsTable = ({ contributors, totalExpenses }: ContributorsTableProps) => {
  if (contributors.length <= 1) return null;

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Contributeur</TableHead>
            <TableHead className="text-right">Revenus mensuels</TableHead>
            <TableHead className="text-right">Part des revenus</TableHead>
            <TableHead className="text-right">Participation aux charges</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contributors.map((contributor) => {
            const expenseShare = (totalExpenses * contributor.percentage_contribution) / 100;
            
            return (
              <TableRow key={contributor.name}>
                <TableCell className="font-medium">{contributor.name}</TableCell>
                <TableCell className="text-right">{contributor.total_contribution.toFixed(2)} €</TableCell>
                <TableCell className="text-right">{contributor.percentage_contribution.toFixed(1)}%</TableCell>
                <TableCell className="text-right">{expenseShare.toFixed(2)} €</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
