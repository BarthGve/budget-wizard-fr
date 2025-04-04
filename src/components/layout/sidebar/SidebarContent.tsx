import { NavigationMenu } from "@/components/layout/NavigationMenu";

interface SidebarContentProps {
  collapsed: boolean;
  isAdmin: boolean;
  userId?: string;
  onItemClick?: () => void;
}

export const SidebarContent = ({ collapsed, isAdmin, userId, onItemClick }: SidebarContentProps) => {
  return (
    <div className="flex-1 overflow-y-auto flex flex-col">
      {/* Menu de navigation */}
      <NavigationMenu 
        collapsed={collapsed} 
        isAdmin={isAdmin}
        userId={userId}
        onItemClick={onItemClick}
      />
    </div>
  );
};
