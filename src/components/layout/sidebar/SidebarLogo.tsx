
import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface SidebarLogoProps {
  collapsed: boolean;
}

export const SidebarLogo: React.FC<SidebarLogoProps> = ({ collapsed }) => {
  return (
    <Link to="/dashboard" className="flex items-center gap-2">
      <img
        src="/lovable-uploads/9f7c5b9f-f126-45eb-8e10-1a3c1de218a6.avif"
        alt="Logo"
        className="h-8 w-8"
      />
      {!collapsed && (
        <span className={cn(
          "font-semibold text-lg transition-opacity",
          collapsed ? "opacity-0 hidden" : "opacity-100"
        )}>
          Budget Wizard
        </span>
      )}
    </Link>
  );
};
