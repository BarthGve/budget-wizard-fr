
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types/profile";
import { NavigationMenu } from "./NavigationMenu";
import { UserDropdown } from "./UserDropdown";
import { ThemeToggle } from "../theme/ThemeToggle";
import { appConfig } from "@/config/app.config";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLatestVersion } from "@/hooks/useLatestVersion";
import { FeedbackDialog } from "../feedback/FeedbackDialog";

interface SidebarProps {
  className?: string;
  onClose?: () => void;
}

export const Sidebar = ({ className, onClose }: SidebarProps) => {
  const isMobile = useIsMobile();
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebarCollapsed");
    return saved ? JSON.parse(saved) : (isMobile ? true : false);
  });
  const { latestVersion } = useLatestVersion();

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", JSON.stringify(collapsed));
  }, [collapsed]);

  useEffect(() => {
    if (isMobile) {
      setCollapsed(true);
    }
  }, [isMobile]);

  // Récupère d'abord l'utilisateur actuel pour avoir son ID
  const { data: currentUser } = useQuery({
    queryKey: ["current-user-for-sidebar"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
    staleTime: 1000 * 60, // 1 minute
  });

  const { data: profile } = useQuery<Profile>({
    queryKey: ["profile-for-sidebar", currentUser?.id],
    queryFn: async () => {
      if (!currentUser) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", currentUser.id)
        .single();

      if (error) throw error;

      const profileData = {
        ...data,
        email: currentUser.email
      } as Profile;

      return profileData;
    },
    enabled: !!currentUser,
    staleTime: 1000 * 60, // 1 minute
  });

  const { data: isAdmin } = useQuery({
    queryKey: ["isAdmin-for-sidebar", currentUser?.id],
    queryFn: async () => {
      if (!currentUser) return false;

      const { data, error } = await supabase.rpc('has_role', {
        user_id: currentUser.id,
        role: 'admin'
      });

      if (error) throw error;
      return data;
    },
    enabled: !!currentUser,
    staleTime: 1000 * 60, // 1 minute
  });

  const handleClickOutside = (e: MouseEvent) => {
    if (isMobile && onClose && (e.target as HTMLElement).closest('.sidebar-content') === null) {
      onClose();
    }
  };

  useEffect(() => {
    if (isMobile) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isMobile, onClose]);

  return (
    <aside
      className={cn(
        "relative h-screen bg-background border-r rounded-r-xl border-border transition-all duration-300 flex flex-col touch-scroll sidebar-content",
        collapsed ? "w-16" : "w-64",
        isMobile && "fixed z-50 shadow-lg",
        className
      )}
    >
      <div className="flex flex-col flex-1 ios-top-safe">
        <div className="p-4 border-b rounded-r-xl border-border">
          <div className="flex flex-col">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h1
                  className={cn(   
                    "font-bold text-foreground tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-fade-in transition-all duration-300",
                    collapsed ? "text-sm" : "text-xl"
                  )}
                >
                  {collapsed ? appConfig.initiales : appConfig.name}
                </h1>
              </div>
              <div className="flex items-center gap-2">
                <ThemeToggle collapsed={collapsed} />
              </div>
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
  
        <NavigationMenu collapsed={collapsed} isAdmin={isAdmin || false} />
        
        {!isAdmin && (
          <div className={cn(
            "mt-auto border-t border-gray-200 pt-4 px-4",
            collapsed && "flex justify-center"
          )}>
            <FeedbackDialog collapsed={collapsed} />
          </div>
        )}
        
        <UserDropdown collapsed={collapsed} profile={profile} />
      </div>
  
      {!isMobile && (
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "absolute -right-3 top-20 p-1.5 rounded-full bg-background border border-border hover:bg-accent transition-colors",
            "z-50 shadow-sm touch-manipulation"
          )}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-muted-foreground" />
          )}
        </button>
      )}
    </aside>
  );
};
