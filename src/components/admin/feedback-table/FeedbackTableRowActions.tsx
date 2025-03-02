
import { Button } from "@/components/ui/button";
import { Check, Trash, X } from "lucide-react";

interface FeedbackTableRowActionsProps {
  status: "pending" | "read" | "published";
  onApprove: (e: React.MouseEvent) => void;
  onUnapprove: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
}

export const FeedbackTableRowActions = ({
  status,
  onApprove,
  onUnapprove,
  onDelete,
}: FeedbackTableRowActionsProps) => {
  return (
    <div className="flex items-center space-x-2">
      {status !== "published" ? (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
          onClick={onApprove}
          title="Publier"
        >
          <Check className="h-4 w-4" />
          <span className="sr-only">Publier</span>
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          onClick={onUnapprove}
          title="Retirer la publication"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Retirer la publication</span>
        </Button>
      )}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
        onClick={onDelete}
        title="Supprimer"
      >
        <Trash className="h-4 w-4" />
        <span className="sr-only">Supprimer</span>
      </Button>
    </div>
  );
};
