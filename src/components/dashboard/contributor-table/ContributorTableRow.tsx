
import { Contributor } from "@/types/contributor";
import { TableCell, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatarColor, getInitials } from "@/utils/avatarColors";

interface ContributorTableRowProps {
  contributor: Contributor;
  expenseShare: number;
  creditShare: number;
  isDarkTheme: boolean;
  avatarUrl?: string | null;
  onSelect: (contributor: Contributor) => void;
}

export function ContributorTableRow({
  contributor,
  expenseShare,
  creditShare,
  isDarkTheme,
  avatarUrl,
  onSelect,
}: ContributorTableRowProps) {
  const initials = getInitials(contributor.name);
  const avatarColors = getAvatarColor(contributor.name, isDarkTheme);
  
  return (
    <TableRow 
      className="cursor-pointer hover:bg-muted/50"
      onClick={() => {
        onSelect({
          ...contributor,
          expenseShare,
          creditShare
        });
      }}
    >
      <TableCell className="font-medium">
        <div className="flex items-center space-x-3">
          <Avatar>
            {contributor.is_owner && avatarUrl ? (
              <AvatarImage src={avatarUrl} alt={contributor.name} />
            ) : null}
            <AvatarFallback
              style={{
                backgroundColor: avatarColors.background,
                color: avatarColors.text,
              }}
            >
              {initials}
            </AvatarFallback>
          </Avatar>
          <span>{contributor.name}</span>
        </div>
      </TableCell>
      <TableCell className="text-right">{contributor.total_contribution.toFixed(2)} €</TableCell>
      <TableCell className="text-right">{contributor.percentage_contribution.toFixed(1)}%</TableCell>
      <TableCell className="text-right">{expenseShare.toFixed(2)} €</TableCell>
      <TableCell className="text-right">{creditShare.toFixed(2)} €</TableCell>
    </TableRow>
  );
}
