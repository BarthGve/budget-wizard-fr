
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileSidebarToggleProps {
  toggleSidebar: () => void;
}

// Composant pour le bouton de basculement de la sidebar sur mobile
export const MobileSidebarToggle = ({ toggleSidebar }: MobileSidebarToggleProps) => {
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleSidebar}
      className="fixed left-4 top-4 z-50 rounded-full shadow-lg bg-background hover:bg-accent ios-top-safe"
    >
      <Menu className="h-5 w-5" />
    </Button>
  );
};
