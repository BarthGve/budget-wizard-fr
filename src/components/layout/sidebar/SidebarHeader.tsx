
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
    "font-bold tracking-tight bg-clip-text text-transparent animate-fade-in transition-all",
    "bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500",
    "dark:from-emerald-300 dark:via-cyan-300 dark:to-blue-400",
    "drop-shadow-sm dark:drop-shadow-[0_0_2px_rgba(79,236,232,0.2)]",
    collapsed 
      ? "text-sm duration-200" 
      : "text-xl lg:text-2xl duration-300 tracking-tighter"
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
