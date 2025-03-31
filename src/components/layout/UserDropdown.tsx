import { useNavigate } from "react-router-dom";
import { LogOut, Bell, UserCircle2, Settings2, ChevronsUpDown, Star, Tag, Sun, Moon, Monitor } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Profile } from "@/types/profile";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { usePagePermissions } from "@/hooks/usePagePermissions";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "next-themes";
import { useAuthContext } from "@/context/AuthProvider";

interface UserDropdownProps {
  collapsed: boolean;
  profile?: Profile;
}

export const UserDropdown = ({
  collapsed,
  profile
}: UserDropdownProps) => {
  const navigate = useNavigate();
  const { isAdmin } = usePagePermissions();
  const isMobile = useIsMobile();
  const { setTheme, theme } = useTheme();
  
  const { logout } = useAuthContext();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className={cn(
      "p-3 sm:p-4", 
      isMobile && "shadow-inner bg-background/95"
    )}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className={cn(
              "w-full h-auto",
              collapsed ? "justify-center p-0" : "justify-start p-2"
            )}>
            <div className={cn(
              "flex items-center w-full",
              collapsed ? "justify-center" : "gap-3"
            )}>
              <div className="relative">
                <Avatar className={cn(
                  "transition-all duration-300",
                  isMobile && collapsed ? "h-9 w-9" : collapsed ? "h-10 w-10" : "h-12 w-12"
                )}>
                  <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.full_name || "Avatar"} />
                  <AvatarFallback>
                    {(profile?.full_name || "?")[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {profile?.profile_type === "pro" && (
                  <Badge 
                    className={cn(
                      "absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-[0.6rem] font-bold px-2 py-0.5 rounded-full border-[1.5px] border-white shadow-sm",
                      collapsed ? "scale-90" : ""
                    )}>
                    Pro
                  </Badge>
                )}
              </div>
              {!collapsed && (
                <div className="flex items-center justify-between flex-1">
                  <div className="flex flex-col items-start">
                    <span className="font-medium text-sm truncate max-w-[120px]">{profile?.full_name || "Utilisateur"}</span>
                    <span className="text-xs text-muted-foreground truncate max-w-[120px]">{profile?.email}</span>
                  </div>
                  <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" side={isMobile ? "top" : "right"} sideOffset={isMobile ? 10 : 20} className="w-[240px]">
          <div className="flex items-center gap-3 p-2 border-b">
            <div className="relative">
              <Avatar className="h-12 w-12">
                <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.full_name || "Avatar"} />
                <AvatarFallback>
                  {(profile?.full_name || "?")[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {profile?.profile_type === "pro" && (
                <Badge className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-[0.6rem] font-bold px-2 py-0.5 rounded-full border-[1.5px] border-white shadow-sm">
                  Pro
                </Badge>
              )}
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-sm">{profile?.full_name || "Utilisateur"}</span>
              <span className="text-xs text-muted-foreground">{profile?.email}</span>
            </div>
          </div>
       
          <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/user-settings")}>
            <UserCircle2 className="mr-2 h-4 w-4" />
            <span>Mon compte</span>
          </DropdownMenuItem>
     
          {isAdmin && (
            <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/user-settings")}>
              <Bell className="mr-2 h-4 w-4" />
              <span>Notifications</span>
            </DropdownMenuItem>
          )}

          {isMobile && (
            <>
              <DropdownMenuItem className="cursor-pointer" onClick={() => setTheme("light")}>
                <Sun className="mr-2 h-4 w-4" />
                <span>Thème clair</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={() => setTheme("dark")}>
                <Moon className="mr-2 h-4 w-4" />
                <span>Thème sombre</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={() => setTheme("system")}>
                <Monitor className="mr-2 h-4 w-4" />
                <span>Thème système</span>
              </DropdownMenuItem>
            </>
          )}

          <DropdownMenuItem className="cursor-pointer text-destructive" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Se déconnecter</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
