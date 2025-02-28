
import { Button } from "@/components/ui/button";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface ContributorCardActionsProps {
  isOwner: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export const ContributorCardActions = ({
  isOwner,
  onEdit,
  onDelete,
}: ContributorCardActionsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" type="button">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuItem onClick={(e) => {
          e.preventDefault();
          onEdit();
        }}>
          <Pencil className="mr-2 h-4 w-4" />
          Modifier
        </DropdownMenuItem>
        {!isOwner && (
          <DropdownMenuItem 
            className="text-destructive" 
            onClick={(e) => {
              e.preventDefault();
              onDelete();
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Supprimer
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
