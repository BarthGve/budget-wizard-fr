
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

interface SidebarProps {
  className?: string;
}

export const Sidebar = ({ className }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebarCollapsed");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", JSON.stringify(collapsed));
  }, [collapsed]);

  const { data: profile } = useQuery<Profile>({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (error) throw error;

      const profileData = {
        ...data,
        email: user?.email
      } as Profile;

      return profileData;
    },
  });

  const { data: isAdmin } = useQuery({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data, error } = await supabase.rpc('has_role', {
        user_id: user.id,
        role: 'admin'
      });

      if (error) throw error;
      return data;
    }
  });

  return (
    <aside
      className={cn(
        "relative h-screen bg-background border-r rounded-r-xl border-border transition-all duration-300 flex flex-col",
        collapsed ? "w-20" : "w-64",
        className
      )}
    >
      <div className="flex flex-col flex-1">
        <div className="p-4 border-b rounded-r-xl border-border padding-bottom: 8px !important">
          <div className="flex flex-col ">
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
               {appConfig.version}
             </span>
             {profile?.profile_type === "pro" && (
               <Badge variant="secondary" className="text-xs bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
                 Pro
               </Badge>
             )}
           </div>
            )}
          </div>
        </div>
  
        <NavigationMenu collapsed={collapsed} isAdmin={isAdmin || false} />
        <UserDropdown collapsed={collapsed} profile={profile} />
      </div>
  
      <button
        onClick={() => setCollapsed(!collapsed)}
        className={cn(
          "absolute -right-3 top-5 p-1 rounded-full bg-background border border-border hover:bg-accent transition-colors",
          "z-50 shadow-sm"
        )}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? (
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronLeft className="h-4 w-4 text-muted-foreground" />
        )}
      </button>
    </aside>
  );
};
