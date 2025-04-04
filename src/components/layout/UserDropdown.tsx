
import { useNavigate } from "react-router-dom";
import { LogOut, Bell, UserCircle2, Settings2, ChevronsUpDown, Sun, Moon, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Profile } from "@/types/profile";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { usePagePermissions } from "@/hooks/usePagePermissions";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "next-themes";
import { useAuthContext } from "@/context/AuthProvider";
import { useEffect, useState } from "react";

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
  const { setTheme } = useTheme();
  
  const { logout } = useAuthContext();
  const [localProfile, setLocalProfile] = useState<Profile | undefined>(profile);
  const [mounted, setMounted] = useState(false);
  
  // Assurer que le composant est monté côté client
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Mettre à jour le profil local quand les props changent
  useEffect(() => {
    if (profile && (!localProfile || profile.id !== localProfile.id)) {
      console.log("UserDropdown - Mise à jour du profil:", profile.email);
      setLocalProfile(profile);
    }
  }, [profile, localProfile]);

  const handleLogout = async () => {
    try {
      console.log("Déconnexion...");
      await logout();
    } catch (error) {
      console.error("Erreur de déconnexion:", error);
    }
  };

  // Fonction pour appliquer le thème avec une animation de transition
  const applyTheme = (newTheme: string) => {
    setTheme(newTheme);
    
    // Ajouter une classe pour forcer le rafraîchissement du rendu
    document.documentElement.classList.add('theme-updated');
    
    // Supprimer la classe après l'animation
    setTimeout(() => {
      document.documentElement.classList.remove('theme-updated');
    }, 100);
    
    console.log("Thème appliqué:", newTheme);
  };

  if (!mounted) {
    return null;
  }

  // Si pas de profil, afficher un bouton de connexion
  if (!localProfile) {
    return (
      <div className="p-4">
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={() => navigate("/login")}
        >
          Se connecter
        </Button>
      </div>
    );
  }

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
                  <AvatarImage src={localProfile?.avatar_url || undefined} alt={localProfile?.full_name || "Avatar"} />
                  <AvatarFallback>
                    {(localProfile?.full_name || "?")[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {localProfile?.profile_type === "pro" && (
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
                    <span className="font-medium text-sm truncate max-w-[120px]">{localProfile?.full_name || "Utilisateur"}</span>
                    <span className="text-xs text-muted-foreground truncate max-w-[120px]">{localProfile?.email}</span>
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
                <AvatarImage src={localProfile?.avatar_url || undefined} alt={localProfile?.full_name || "Avatar"} />
                <AvatarFallback>
                  {(localProfile?.full_name || "?")[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {localProfile?.profile_type === "pro" && (
                <Badge className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-[0.6rem] font-bold px-2 py-0.5 rounded-full border-[1.5px] border-white shadow-sm">
                  Pro
                </Badge>
              )}
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-sm">{localProfile?.full_name || "Utilisateur"}</span>
              <span className="text-xs text-muted-foreground">{localProfile?.email}</span>
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
              <DropdownMenuItem className="cursor-pointer" onClick={() => applyTheme("light")}>
                <Sun className="mr-2 h-4 w-4" />
                <span>Thème clair</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={() => applyTheme("dark")}>
                <Moon className="mr-2 h-4 w-4" />
                <span>Thème sombre</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={() => applyTheme("system")}>
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
