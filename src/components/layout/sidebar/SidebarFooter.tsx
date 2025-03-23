
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
      {/* ThemeToggle pour mobile, placé au-dessus du UserDropdown */}
      {isMobile && (
        <div className="px-4 py-2 border-t border-border">
          <ThemeToggle collapsed={collapsed} />
        </div>
      )}
      
      {/* User dropdown toujours visible, fixé en bas */}
      <div className={cn(
        "sticky bottom-0 bg-background border-t border-border"
      )}>
        <UserDropdown collapsed={collapsed} profile={profile} />
      </div>
    </>
  );
};
