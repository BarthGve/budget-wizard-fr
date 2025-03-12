import { Button } from "@/components/ui/button";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

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
  const [open, setOpen] = useState(false);
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
       <Button variant="outline" size="icon" className="h-8 w-8" type="button">
            <MoreVertical className="h-4 w-4" />
          </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className={cn(
          "w-[180px] p-1.5",
          // Light mode
          "border-amber-100",
          // Dark mode
          "dark:border-gray-700 dark:bg-gray-800"
        )}
        style={{
          boxShadow: isDarkMode 
            ? '0 10px 25px -5px rgba(0,0,0,0.3)' 
            : '0 10px 25px -5px rgba(0,0,0,0.1), 0 0 0 1px rgba(249, 168, 37, 0.05)'
        }}
      >
        <DropdownMenuItem 
          onClick={(e) => {
            e.stopPropagation();
            setOpen(false);
            onEdit();
          }}
          className={cn(
            "cursor-pointer flex items-center py-2 px-3 rounded-md transition-colors",
            // Light mode
            "hover:bg-amber-50 focus:bg-amber-50 data-[highlighted]:bg-amber-50",
            "hover:text-amber-700 focus:text-amber-700",
            // Dark mode
            "dark:hover:bg-amber-900/20 dark:focus:bg-amber-900/20 dark:data-[highlighted]:bg-amber-900/20",
            "dark:hover:text-amber-300 dark:focus:text-amber-300"
          )}
        >
          <div className={cn(
            "mr-2 p-1 rounded-md",
            // Light mode
            "bg-amber-100 text-amber-600",
            // Dark mode
            "dark:bg-amber-900/30 dark:text-amber-400"
          )}>
            <Pencil className="h-3.5 w-3.5" strokeWidth={2} />
          </div>
          <span className="font-medium">Modifier</span>
        </DropdownMenuItem>
        
        {!isOwner && (
          <>
            <DropdownMenuSeparator className={cn(
              "my-1.5 h-px",
              // Light mode
              "bg-amber-100/70",
              // Dark mode
              "dark:bg-gray-700"
            )} />
            
            <DropdownMenuItem 
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
                onDelete();
              }}
              className={cn(
                "cursor-pointer flex items-center py-2 px-3 rounded-md transition-colors",
                // Light mode - style destructif
                "hover:bg-red-50 focus:bg-red-50 data-[highlighted]:bg-red-50",
                "hover:text-red-600 focus:text-red-600 text-red-500",
                // Dark mode - style destructif
                "dark:hover:bg-red-900/20 dark:focus:bg-red-900/20 dark:data-[highlighted]:bg-red-900/20",
                "dark:hover:text-red-300 dark:focus:text-red-300 dark:text-red-400"
              )}
            >
              <div className={cn(
                "mr-2 p-1 rounded-md",
                // Light mode
                "bg-red-100 text-red-500",
                // Dark mode
                "dark:bg-red-900/30 dark:text-red-400"
              )}>
                <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
              </div>
              <span className="font-medium">Supprimer</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
