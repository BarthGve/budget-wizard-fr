
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
      <div className="mt-4 flex items-start gap-1.5 px-2 py-0.5 rounded-full bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30">
  <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
  <span className="text-xs font-medium text-primary dark:text-primary/90">
    {latestVersion || appConfig.version}
  </span>
</div>
        )}
        
      
          <ThemeToggle collapsed={collapsed} />
     
    
      </div>
    </div>
  );
};
