
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash2, CheckCircle2, CircleDashed, Clock } from "lucide-react";

interface ContributionTableRowActionsProps {
  id: string;
  status: "pending" | "in_progress" | "completed";
  onDelete: () => void;
  onUpdateStatus: (status: "pending" | "in_progress" | "completed") => void;
  onClick: (e: React.MouseEvent) => void;
}

export const ContributionTableRowActions = ({
  id,
  status,
  onDelete,
  onUpdateStatus,
  onClick,
}: ContributionTableRowActionsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild onClick={onClick}>
        <Button variant="ghost" className="h-8 w-8 p-0" aria-label="Actions">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {status !== "pending" && (
          <DropdownMenuItem onClick={(e) => {
            e.stopPropagation();
            onUpdateStatus("pending");
          }}>
            <CircleDashed className="mr-2 h-4 w-4" />
            <span>Marquer à traiter</span>
          </DropdownMenuItem>
        )}
        
        {status !== "in_progress" && (
          <DropdownMenuItem onClick={(e) => {
            e.stopPropagation();
            onUpdateStatus("in_progress");
          }}>
            <Clock className="mr-2 h-4 w-4" />
            <span>Marquer en cours</span>
          </DropdownMenuItem>
        )}
        
        {status !== "completed" && (
          <DropdownMenuItem onClick={(e) => {
            e.stopPropagation();
            onUpdateStatus("completed");
          }}>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            <span>Marquer comme traité</span>
          </DropdownMenuItem>
        )}
        
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          <span>Supprimer</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
