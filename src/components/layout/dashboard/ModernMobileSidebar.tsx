
import React from "react";
import { Sheet, SheetContent, SheetOverlay } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { NavigationMenu } from "@/components/layout/NavigationMenu";
import { UserDropdown } from "@/components/layout/UserDropdown";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Profile } from "@/types/profile";

interface ModernMobileSidebarProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userId?: string;
  isAdmin?: boolean;
  profile?: Profile;
}

// Composant de sidebar moderne pour mobile avec effet de flottement au-dessus du contenu
export const ModernMobileSidebar = ({
  isOpen,
  onOpenChange,
  userId,
  isAdmin = false,
  profile
}: ModernMobileSidebarProps) => {
  // Fonction pour fermer la sidebar quand un lien est cliqué
  const handleItemClick = () => {
    onOpenChange(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetOverlay className="bg-black/60 backdrop-blur-sm" />
      <SheetContent 
        side="left" 
        className={cn(
          "p-0 w-3/4 max-w-[280px] border-r shadow-lg",
          "bg-white dark:bg-gray-900",
          "rounded-r-xl ios-top-safe ios-bottom-safe",
        )}
      >
        <div className="flex flex-col h-full pb-safe">
          {/* Contenu de la navigation */}
          <div className="flex-1 overflow-y-auto scrollbar-none py-2">
            <NavigationMenu 
              collapsed={false} 
              isAdmin={!!isAdmin} 
              userId={userId}
              onItemClick={handleItemClick}
            />
          </div>
          
          {/* Footer avec thème et profil utilisateur */}
          <div className="mt-auto border-t border-gray-200 dark:border-gray-800 py-2">
            <div className="flex justify-end px-4 py-2">
              <ThemeToggle collapsed={false} />
            </div>
            
            {profile && (
              <div className="px-2">
                <UserDropdown collapsed={false} profile={profile} />
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
