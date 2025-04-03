
import { Profile } from "@/types/profile";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { UserDropdown } from "@/components/layout/UserDropdown";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface SidebarFooterProps {
  collapsed: boolean;
  profile?: Profile;
}

export const SidebarFooter = ({ collapsed, profile }: SidebarFooterProps) => {
  const isMobile = useIsMobile();

  return (
    <>
 
      {/* User dropdown fixé en bas avec espacement amélioré */}
      <div className={cn(
        "sticky bottom-0 bg-background border-t border-border py-2"
      )}>
        <UserDropdown collapsed={collapsed} profile={profile} />
      </div>
    </>
  );
};
