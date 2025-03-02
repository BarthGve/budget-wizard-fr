
import { TableCell, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Feedback } from "@/types/feedback";
import { FeedbackStatusBadge } from "./FeedbackStatusBadge";
import { FeedbackTableRowActions } from "./FeedbackTableRowActions";
import { renderStars } from "./utils";

interface FeedbackTableRowProps {
  feedback: Feedback;
  onRowClick: () => void;
  onApprove: (id: string) => void;
  onUnapprove: (id: string) => void;
  onDeleteClick: (id: string) => void;
}

export const FeedbackTableRow = ({
  feedback,
  onRowClick,
  onApprove,
  onUnapprove,
  onDeleteClick,
}: FeedbackTableRowProps) => {
  const handleApproveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onApprove(feedback.id);
  };

  const handleUnapproveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUnapprove(feedback.id);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteClick(feedback.id);
  };

  return (
    <TableRow
      className="cursor-pointer hover:bg-muted/50"
      onClick={onRowClick}
    >
      <TableCell>
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src={feedback.profile.avatar_url || undefined} />
            <AvatarFallback>
              {feedback.profile.full_name?.[0]?.toUpperCase() || "?"}
            </AvatarFallback>
          </Avatar>
          <span>{feedback.profile.full_name}</span>
        </div>
      </TableCell>
      <TableCell>{feedback.title}</TableCell>
      <TableCell>
        <div className="space-y-1">
          <div className="flex space-x-1">
            {renderStars(feedback.rating)}
          </div>
          <div className="text-sm text-gray-500">
            {formatDistanceToNow(new Date(feedback.created_at), {
              addSuffix: true,
              locale: fr,
            })}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <FeedbackStatusBadge status={feedback.status} />
      </TableCell>
      <TableCell>
        <FeedbackTableRowActions
          status={feedback.status}
          onApprove={handleApproveClick}
          onUnapprove={handleUnapproveClick}
          onDelete={handleDeleteClick}
        />
      </TableCell>
    </TableRow>
  );
};
