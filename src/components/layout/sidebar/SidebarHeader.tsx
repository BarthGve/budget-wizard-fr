
import React from "react";
import { cn } from "@/lib/utils";

interface SidebarHeaderProps {
  collapsed: boolean;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({ collapsed }) => {
  return (
    <div className={cn(
      "p-4 border-b",
      collapsed ? "flex justify-center" : ""
    )}>
      <div className="flex items-center">
        <img
          src="/lovable-uploads/9f7c5b9f-f126-45eb-8e10-1a3c1de218a6.avif"
          alt="Logo"
          className="h-8 w-8"
        />
        {!collapsed && (
          <span className="ml-2 font-semibold text-lg transition-opacity">
            Budget Wizard
          </span>
        )}
      </div>
    </div>
  );
};
