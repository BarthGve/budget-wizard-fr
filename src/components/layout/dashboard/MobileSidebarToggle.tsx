
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileSidebarToggleProps {
  toggleSidebar: () => void;
}

// Composant pour le bouton de basculement de la sidebar sur mobile avec design moderne
export const MobileSidebarToggle = ({ toggleSidebar }: MobileSidebarToggleProps) => {
  return (
    <Button
      variant="outline"
      onClick={toggleSidebar}
      className="fixed left-5 bottom-2 z-50 rounded-full shadow-lg bg-background hover:bg-accent ios-top-safe w-14 h-14 border border-border dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 flex items-center justify-center p-0"
    >
      <div className="flex items-center justify-center w-full h-full">
        <Menu className="h-6 w-6 text-foreground" />
      </div>
    </Button>
  );
};
