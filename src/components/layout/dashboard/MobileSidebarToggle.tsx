
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileSidebarToggleProps {
  toggleSidebar: () => void;
}

// Composant pour le bouton de basculement de la sidebar moderne sur mobile
export const MobileSidebarToggle = ({ toggleSidebar }: MobileSidebarToggleProps) => {
  return (
    <Button
      variant="outline"
      onClick={toggleSidebar}
      className="fixed left-5 top-4 z-50 rounded-full shadow-xl bg-background hover:bg-accent ios-top-safe w-14 h-14 border border-gray-200 hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-700 transition-all duration-300 flex items-center justify-center p-0"
      style={{
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
      }}
    >
      <div className="fixed left-5 bottom-20 flex items-center justify-center w-full h-full">
        <Menu className="h-6 w-6 text-gray-700 dark:text-gray-300" />
      </div>
    </Button>
  );
};
