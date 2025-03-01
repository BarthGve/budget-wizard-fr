
import { Button } from "@/components/ui/button";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

export interface ActionOption {
  label: string;
  icon?: React.ReactNode;
  onClick: (e: React.MouseEvent) => void;
  className?: string;
}

export interface CardActionsProps {
  options: ActionOption[];
  buttonVariant?: "outline" | "ghost";
  buttonSize?: "default" | "sm" | "lg" | "icon";
  align?: "start" | "end";
  width?: string;
}

export const CardActions = ({
  options,
  buttonVariant = "outline",
  buttonSize = "icon",
  align = "end",
  width = "w-[200px]"
}: CardActionsProps) => {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={buttonVariant} 
          size={buttonSize} 
          type="button"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className={width}>
        {options.map((option, index) => (
          <DropdownMenuItem 
            key={index} 
            className={option.className}
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
              option.onClick(e);
            }}
          >
            {option.icon}
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
