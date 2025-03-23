
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { appConfig } from "@/config/app.config";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLatestVersion } from "@/hooks/useLatestVersion";

interface SidebarHeaderProps {
  collapsed: boolean;
}

export const SidebarHeader = ({ collapsed }: SidebarHeaderProps) => {
  const isMobile = useIsMobile();
  const { latestVersion } = useLatestVersion();

  return (
    <div className="sticky top-0 z-10 bg-background p-4 border-b rounded-r-xl border-border">
      <div className="flex flex-col">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1
              className={cn(   
                "font-bold text-foreground tracking-tight bg-clip-text text-transparent animate-fade-in transition-all duration-300",
                // Dégradé plus subtil avec des tons légèrement moins saturés
                "bg-gradient-to-r from-indigo-400/90 via-purple-400/90 to-pink-400/85",
                // Variante pour le mode sombre avec des tons plus lumineux mais toujours subtils
                "dark:from-indigo-300 dark:via-purple-300 dark:to-pink-300",
                collapsed ? "text-sm" : "text-xl"
              )}
            >
              {collapsed ? appConfig.initiales : appConfig.name}
            </h1>
          </div>
          {/* ThemeToggle seulement visible sur desktop en en-tête */}
          {!isMobile && (
            <div className="flex items-center gap-2">
              <ThemeToggle collapsed={collapsed} />
            </div>
          )}
        </div>
        {!collapsed && (
          <div className="flex items-baseline gap-2">
            <span className="text-xs text-muted-foreground">
              v{latestVersion || appConfig.version}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
