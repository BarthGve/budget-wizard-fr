
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { NavigationMenu } from "@/components/layout/NavigationMenu";

interface SidebarContentProps {
  collapsed: boolean;
  isAdmin: boolean;
  userId?: string;
}

export const SidebarContent = ({ collapsed, isAdmin, userId }: SidebarContentProps) => {
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Menu de navigation avec flex-1 pour qu'il prenne tout l'espace disponible */}
      <div className="flex-1 overflow-y-auto mb-4">
        <NavigationMenu collapsed={collapsed} isAdmin={isAdmin} userId={userId} />
      </div>
      
      {/* Zone de séparation visuelle */}
      <div className="px-2 mb-2">
        <div className="h-[1px] bg-border/40 w-full"></div>
      </div>
      
      {/* La carte d'annonce de projet a été supprimée de cette section */}
    </div>
  );
};
