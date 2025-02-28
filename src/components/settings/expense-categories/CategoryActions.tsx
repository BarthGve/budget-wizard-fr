
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CategoryActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

export const CategoryActions = ({ onEdit, onDelete }: CategoryActionsProps) => {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          type="button"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            setOpen(false);
            onEdit();
          }}
        >
          <Pencil className="mr-2 h-4 w-4" />
          Modifier
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-destructive"
          onClick={(e) => {
            e.stopPropagation();
            setOpen(false);
            onDelete();
          }}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Supprimer
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
