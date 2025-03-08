
import { TableRow, TableCell } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Contribution } from "@/hooks/useContributions";
import { ContributionStatusBadge } from "./ContributionStatusBadge";
import { ContributionTableRowActions } from "./ContributionTableRowActions";
import { Badge } from "@/components/ui/badge";
import { ContributionsKanban, getTypeBadge } from "../ContributionsKanban";

interface ContributionTableRowProps {
  contribution: Contribution;
  onRowClick: () => void;
  onDeleteClick: (id: string) => void;
  onUpdateStatus: (id: string, status: "pending" | "in_progress" | "completed") => void;
}

export const ContributionTableRow = ({
  contribution,
  onRowClick,
  onDeleteClick,
  onUpdateStatus
}: ContributionTableRowProps) => {
  const { color, text } = getTypeBadge(contribution.type);
  
  return (
    <TableRow
      key={contribution.id}
      className="cursor-pointer hover:bg-gray-50"
      onClick={onRowClick}
    >
      <TableCell className="font-medium">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={contribution.profile.avatar_url || undefined} />
            <AvatarFallback>
              {(contribution.profile.full_name || "?")[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm">{contribution.profile.full_name}</span>
        </div>
      </TableCell>
      <TableCell>
        <Badge className={`${color} font-medium`}>
          {text}
        </Badge>
      </TableCell>
      <TableCell className="max-w-[200px]">
        <div className="truncate font-medium">{contribution.title}</div>
        <div className="truncate text-xs text-muted-foreground">
          {contribution.content.substring(0, 60)}...
        </div>
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {formatDistanceToNow(new Date(contribution.created_at), {
          addSuffix: true,
          locale: fr,
        })}
      </TableCell>
      <TableCell>
        <ContributionStatusBadge status={contribution.status} />
      </TableCell>
      <TableCell className="text-right">
        <ContributionTableRowActions
          id={contribution.id}
          status={contribution.status}
          onDelete={() => onDeleteClick(contribution.id)}
          onUpdateStatus={(status) => onUpdateStatus(contribution.id, status)}
          onClick={(e) => e.stopPropagation()}
        />
      </TableCell>
    </TableRow>
  );
};
