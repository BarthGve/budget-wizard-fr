
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
      {/* Le NavigationMenu avec flex-1 pour qu'il prenne tout l'espace disponible */}
      <div className="flex-1 overflow-y-auto">
        <NavigationMenu collapsed={collapsed} isAdmin={isAdmin} />
      </div>
      
      {/* Project announcement card - reste visible en bas */}
      <div className="px-4 py-2">
        <ProjectAnnouncementCard collapsed={collapsed} userId={userId} />
      </div>
      
      {/* Feedback dialog - reste visible en bas */}
      {!isAdmin && (
        <div className="px-4 py-2">
          <FeedbackDialog collapsed={collapsed} />
        </div>
      )}
    </div>
  );
};
