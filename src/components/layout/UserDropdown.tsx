
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
  isLoading?: boolean;
}

export const UserDropdown = ({
  collapsed,
  profile,
  isLoading = false
}: UserDropdownProps) => {
  const navigate = useNavigate();
  const { isAdmin } = usePagePermissions();
  const isMobile = useIsMobile();
  const { setTheme } = useTheme();
  
  const { logout, isAuthenticated } = useAuthContext();
  const [localProfile, setLocalProfile] = useState<Profile | undefined>(profile);
  const [mounted, setMounted] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
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

  const handleLogout = async (e: React.MouseEvent) => {
    try {
      e.preventDefault();
      e.stopPropagation();
      
      // Éviter les clics multiples
      if (isLoggingOut) {
        console.log("Déconnexion déjà en cours, ignoré");
        return;
      }
      
      setIsLoggingOut(true);
      console.log("UserDropdown: Démarrage de la déconnexion...");
      
      // Appel à la fonction de déconnexion du contexte d'authentification
      await logout();
      
      // La redirection sera gérée par le hook useAuth
    } catch (error) {
      console.error("UserDropdown: Erreur lors de la déconnexion:", error);
      setIsLoggingOut(false);
    }
  };

  // Si pas monté, ne rien afficher
  if (!mounted) {
    return null;
  }

  // Si chargement en cours, afficher un état de chargement
  if (isLoading) {
    return (
      <div className={cn("p-2", isMobile ? "shadow-none" : "p-3 sm:p-2")}>
        <Button variant="ghost" className={cn(
          "w-full h-auto",
          collapsed && isMobile ? "justify-center p-0 rounded-full" : 
          collapsed ? "justify-center p-0" : "justify-start p-0"
        )}>
          <div className={cn(
            "flex items-center w-full",
            collapsed ? "justify-center" : "gap-3"
          )}>
            <div className="relative">
              <Avatar className={cn(
                "transition-all duration-300 border-2 border-background animate-pulse",
                isMobile && collapsed ? "h-12 w-12" : collapsed ? "h-10 w-10" : "h-12 w-12"
              )}>
                <AvatarFallback className="bg-gray-200 dark:bg-gray-700" />
              </Avatar>
            </div>
          </div>
        </Button>
      </div>
    );
  }

  // Si pas de profil et pas en cours de chargement, afficher un bouton de connexion
  if (!localProfile && !isAuthenticated) {
    return (
      <div className={cn("p-2", isMobile ? "shadow-none" : "p-3 sm:p-2")}>
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

  // Si authentifié mais pas de profil, essayer d'utiliser les données d'authentification
  if (isAuthenticated && !localProfile) {
    return (
      <div className={cn("p-2", isMobile ? "shadow-none" : "p-3 sm:p-2")}>
        <Button 
          variant="ghost" 
          className={cn(
            "w-full h-auto",
            collapsed && isMobile ? "justify-center p-0 rounded-full" : 
            collapsed ? "justify-center p-0" : "justify-start p-0"
          )}>
          <div className={cn(
            "flex items-center w-full",
            collapsed ? "justify-center" : "gap-3"
          )}>
            <div className="relative">
              <Avatar className={cn(
                "transition-all duration-300 border-2 border-background",
                isMobile && collapsed ? "h-12 w-12" : collapsed ? "h-10 w-10" : "h-12 w-12"
              )}>
                <AvatarFallback>?</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </Button>
      </div>
    );
  }

  // Affichage normal avec le profil
  return (
    <div className={cn(
      "p-2", 
      isMobile ? "shadow-none" : "p-3 sm:p-2"
    )}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className={cn(
              "w-full h-auto",
              collapsed && isMobile ? "justify-center p-0 rounded-full" : 
              collapsed ? "justify-center p-0" : "justify-start p-0"
            )}>
            <div className={cn(
              "flex items-center w-full",
              collapsed ? "justify-center" : "gap-3"
            )}>
              <div className="relative">
                <Avatar className={cn(
                  "transition-all duration-300 border-2 border-background",
                  isMobile && collapsed ? "h-12 w-12" : collapsed ? "h-10 w-10" : "h-12 w-12"
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
        <DropdownMenuContent align="end" side={isMobile ? "bottom" : "right"} sideOffset={isMobile ? 10 : 20} className="w-[240px] bg-background/95 backdrop-blur-sm z-[99]">
          <div className="flex items-center gap-3 p-2 border-b">
           
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

          <DropdownMenuItem 
            className="cursor-pointer text-destructive" 
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>{isLoggingOut ? "Déconnexion en cours..." : "Se déconnecter"}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
