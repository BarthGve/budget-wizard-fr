
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MoreVertical, SquarePen, Trash2, Info } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface ExpenseActionsDropdownProps {
  onViewDetails: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const ExpenseActionsDropdown = ({ 
  onViewDetails, 
  onEdit, 
  onDelete 
}: ExpenseActionsDropdownProps) => {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative h-8 w-8">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuItem onClick={() => {
          onViewDetails();
          setOpen(false);
        }}>
          <Info className="mr-2 h-4 w-4"/>
          Détails
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => {
          onEdit();
          setOpen(false);
        }}>
           <SquarePen className="mr-2 h-4 w-4" />
          Modifier
        </DropdownMenuItem>
     
        <DropdownMenuItem 
          className="text-destructive"
          onClick={() => {
            onDelete();
            setOpen(false);
          }}
        >
           <Trash2 className="mr-2 h-4 w-4" />
          Supprimer
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
