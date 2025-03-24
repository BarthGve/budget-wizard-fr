
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { NavigationMenu } from "@/components/layout/NavigationMenu";
import { FeedbackDialog } from "@/components/feedback/FeedbackDialog";
import { ProjectAnnouncementCard } from "@/components/layout/ProjectAnnouncementCard";

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
        <NavigationMenu collapsed={collapsed} isAdmin={isAdmin} />
      </div>
      
      {/* Zone de séparation visuelle */}
      <div className="px-2 mb-2">
        <div className="h-[1px] bg-border/40 w-full"></div>
      </div>
      
      {/* Les éléments du bas avec espacement amélioré */}
      <div className="space-y-3 mb-4">
        {/* Project announcement card */}
        <div className="px-4">
          <ProjectAnnouncementCard collapsed={collapsed} userId={userId} />
        </div>
        
        {/* Feedback dialog - uniquement pour utilisateurs non-admin */}
        {!isAdmin && (
          <div className="px-4">
            <FeedbackDialog collapsed={collapsed} />
          </div>
        )}
      </div>
    </div>
  );
};
