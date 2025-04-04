
import { UserDropdown } from "../UserDropdown";
import { Profile } from "@/types/profile";
import { Skeleton } from "@/components/ui/skeleton";

interface SidebarFooterProps {
  collapsed: boolean;
  profile?: Profile;
  isLoading?: boolean;
}

export const SidebarFooter = ({ 
  collapsed, 
  profile,
  isLoading = false
}: SidebarFooterProps) => {
  return (
    <div className="mt-auto border-t">
      <div className="flex flex-col">
    
        
        {/* Menu utilisateur avec gestion de l'état de chargement */}
        {isLoading ? (
          <div className={`p-4 ${collapsed ? 'flex justify-center' : ''}`}>
            <Skeleton className={`h-10 ${collapsed ? 'w-10 rounded-full' : 'w-full rounded-md'}`} />
          </div>
        ) : (
          <UserDropdown collapsed={collapsed} profile={profile} />
        )}
      </div>
    </div>
  );
};
