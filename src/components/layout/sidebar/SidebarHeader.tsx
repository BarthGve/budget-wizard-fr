
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
    <div className="sticky top-0 z-10 bg-background px-3 pt-3 border-b rounded-r-xl border-border">
      <div className="flex flex-col">
        <div className="flex items-center">
      <h1
  className={cn(   
    "font-semibold text-foreground tracking-tight animate-fade-in transition-all duration-300",
    "text-primary",
    "dark:text-primary/90",
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
        
      
          <ThemeToggle collapsed={collapsed} />
     
    
      </div>
    </div>
  );
};
