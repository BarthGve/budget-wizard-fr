
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
  onClick={toggleSidebar}
  className="fixed left-5 top-5 z-50 rounded-full shadow-lg bg-background hover:bg-accent ios-top-safe p-3 border-2 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 w-14 h-14 flex items-center justify-center"
  style={{
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)"
  }}
>
  <Menu className="h-7 w-7 text-gray-700 dark:text-gray-300" />
</Button>

  );
};
