
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { appConfig } from "@/config/app.config";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLatestVersion } from "@/hooks/useLatestVersion";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

interface SidebarHeaderProps {
  collapsed: boolean;
}

export const SidebarHeader = ({ collapsed }: SidebarHeaderProps) => {
  const isMobile = useIsMobile();
  const { latestVersion } = useLatestVersion();

  return (
    <div className="sticky top-0 z-10 bg-background p-4 border-b rounded-r-xl border-border">
      <div className="flex flex-col mb-1">
        <div className="flex items-center">
          <h1
            className={cn(   
              "font-bold text-foreground tracking-tight bg-clip-text text-transparent animate-fade-in transition-all duration-300",
              "bg-gradient-to-r from-indigo-400/90 via-purple-400/90 to-pink-400/85",
              "dark:from-indigo-300 dark:via-purple-300 dark:to-pink-300",
              collapsed ? "text-sm" : "text-xl"
            )}
          >
            {collapsed ? appConfig.initiales : appConfig.name}
          </h1>
        </div>
        {!collapsed && (
          <div className="flex items-baseline gap-2">
            <span className="text-xs text-muted-foreground">
              v{latestVersion || appConfig.version}
            </span>
          </div>
        )}
         {!isMobile && (
      
          <ThemeToggle collapsed={collapsed} />
     
      )}
      </div>
    </div>
  );
};
