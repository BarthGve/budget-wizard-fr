
import { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types/profile";
import { NavigationMenu } from "./NavigationMenu";
import { UserDropdown } from "./UserDropdown";
import { ThemeToggle } from "../theme/ThemeToggle";
import { appConfig } from "@/config/app.config";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLatestVersion } from "@/hooks/useLatestVersion";
import { FeedbackDialog } from "../feedback/FeedbackDialog";
import { ProjectAnnouncementCard } from "./ProjectAnnouncementCard";

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
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", JSON.stringify(collapsed));
  }, [collapsed]);

  useEffect(() => {
    if (isMobile) {
      setCollapsed(true);
    }
  }, [isMobile]);

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

  // Gérer les liens dans la sidebar pour fermer automatiquement la sidebar sur mobile
  const handleLinkClick = () => {
    if (isMobile && onClose) {
      onClose();
    }
  };

  // Attacher cet événement de clic à tout le contenu de la sidebar pour mobile
  useEffect(() => {
    if (isMobile && sidebarRef.current) {
      const links = sidebarRef.current.querySelectorAll('a');
      
      links.forEach(link => {
        link.addEventListener('click', handleLinkClick);
      });
      
      return () => {
        links.forEach(link => {
          link.removeEventListener('click', handleLinkClick);
        });
      };
    }
  }, [isMobile, onClose, sidebarRef.current]);

  return (
    <aside
      ref={sidebarRef}
      className={cn(
        "relative h-screen bg-background border-r rounded-r-xl border-border transition-all duration-300 flex flex-col touch-scroll sidebar-content",
        collapsed ? "w-16" : "w-64",
        isMobile && "fixed z-50 shadow-lg",
        className
      )}
    >
      <div className="flex flex-col h-full ios-top-safe">
        {/* En-tête fixe en haut */}
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
  
        {/* Contenu déroulant au milieu */}
        <div className="flex-1 overflow-y-auto scrollbar-none">
          <NavigationMenu collapsed={collapsed} isAdmin={isAdmin || false} />
          
          {/* Project announcement card */}
          <ProjectAnnouncementCard collapsed={collapsed} userId={currentUser?.id} />
          
          {/* Feedback dialog */}
          {!isAdmin && (
            <div className="px-4 py-2">
              <FeedbackDialog collapsed={collapsed} />
            </div>
          )}
        </div>
        
        {/* User dropdown toujours visible, fixé en bas */}
        <div className="sticky bottom-0 bg-background border-t border-border">
          <UserDropdown collapsed={collapsed} profile={profile} />
        </div>
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
