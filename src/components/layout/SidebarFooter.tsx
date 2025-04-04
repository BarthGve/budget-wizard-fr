
import React from 'react';
import { UserDropdown } from "./UserDropdown";
import { Profile } from "@/types/profile";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Skeleton } from "@/components/ui/skeleton";

interface SidebarFooterProps {
  collapsed: boolean;
  profile?: Profile;
  isLoading?: boolean;
}

export const SidebarFooter: React.FC<SidebarFooterProps> = ({ 
  collapsed, 
  profile,
  isLoading = false
}) => {
  return (
    <div className="mt-auto border-t">
      <div className="flex flex-col">
        {/* Contrôle du thème */}
        <div className={`p-3 flex ${collapsed ? 'justify-center' : 'justify-end'}`}>
          <ThemeToggle variant="ghost" size="sm" collapsed={collapsed} />
        </div>
        
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
