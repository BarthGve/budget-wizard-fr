
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface MenuButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

/**
 * Bouton principal du FAB qui ouvre/ferme le menu
 */
export const MenuButton = ({ isOpen, onClick }: MenuButtonProps) => {
  return (
    <Button 
      onClick={onClick}
      className={cn(
        "h-14 w-14 rounded-full shadow-xl",
        "bg-primary hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/90",
        "transition-all duration-300 ease-in-out transform",
        isOpen && "rotate-45"
      )}
    >
      <Plus className="h-7 w-7" />
    </Button>
  );
};
