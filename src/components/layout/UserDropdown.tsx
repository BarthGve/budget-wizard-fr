
import { useNavigate } from "react-router-dom";
import { LogOut, Bell, UserCircle2, Settings2, ChevronsUpDown, Star, Tag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Profile } from "@/types/profile";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";

interface UserDropdownProps {
  collapsed: boolean;
  profile?: Profile;
}

export const UserDropdown = ({
  collapsed,
  profile
}: UserDropdownProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    try {
      // Vider le cache avant la déconnexion pour garantir un état propre
      queryClient.clear();
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast.success("Déconnexion réussie");
      navigate("/");
    } catch (error: any) {
      toast.error("Erreur lors de la déconnexion");
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="mt-auto border-t border-gray-200 p-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
        <Button 
  variant="ghost" 
  className={cn(
    "w-full h-auto",
    // Si collapsed, on centre le contenu, sinon on garde l'alignement à gauche
    collapsed ? "justify-center p-0" : "justify-start p-2"
  )}>
  <div className={cn(
    "flex items-center w-full",
    // Si collapsed, on supprime le gap et on centre
    collapsed ? "justify-center" : "gap-3"
  )}>
    <div className="relative">
      <Avatar className={cn(
        "transition-all duration-300",
        // Si collapsed, on réduit légèrement la taille de l'avatar
        collapsed ? "h-10 w-10" : "h-12 w-12"
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
            // Si collapsed, on peut ajuster la taille du badge
            collapsed ? "scale-90" : ""
          )}>
          Pro
        </Badge>
      )}
    </div>
    {/* Le reste du contenu qui n'apparaît que quand non collapsed */}
    {!collapsed && (
      <div className="flex items-center justify-between flex-1">
        <div className="flex flex-col items-start">
          <span className="font-medium text-sm">{profile?.full_name || "Utilisateur"}</span>
          <span className="text-xs text-muted-foreground">{profile?.email}</span>
        </div>
        <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
      </div>
    )}
  </div>
</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" side="right" sideOffset={20} className="w-[240px]">
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
     
      {/*    <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/notifications")}>
            <Bell className="mr-2 h-4 w-4" />
            <span>Notifications</span>
          </DropdownMenuItem> */}

          <DropdownMenuItem className="cursor-pointer text-destructive" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Se déconnecter</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
