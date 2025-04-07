
import { useIsMobile } from "@/hooks/use-mobile";
import { UserDropdown } from "../UserDropdown";
import { Profile } from "@/types/profile";
import { cn } from "@/lib/utils";

interface MobileUserMenuProps {
  profile?: Profile & { isAdmin?: boolean };
  isLoading?: boolean;
}

// Composant pour le menu utilisateur flottant sur mobile
export const MobileUserMenu = ({ 
  profile,
  isLoading = false
}: MobileUserMenuProps) => {
  const isMobile = useIsMobile();
  
  if (!isMobile) return null;
  
  return (
    <div 
      className={cn(
        "fixed top-4 right-4 z-50 ios-top-safe shadow-md rounded-full",
        "bg-background/90 backdrop-blur-sm "
      )}
    >
      <UserDropdown 
        collapsed={true}
        profile={profile}
        isLoading={isLoading}
      />
    </div>
  );
};
