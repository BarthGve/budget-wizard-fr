
import { useNavigate } from "react-router-dom";
import { UserCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Profile } from "@/types/profile";
import { useTheme } from "next-themes";
import { LogOut, Bell, Settings2, Sun, Moon, Monitor } from "lucide-react";
import { useAuthContext } from "@/context/AuthProvider";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { usePagePermissions } from "@/hooks/usePagePermissions";

interface MobileUserButtonProps {
  profile?: Profile;
}

export const MobileUserButton = ({ profile }: MobileUserButtonProps) => {
  const navigate = useNavigate();
  const { setTheme } = useTheme();
  const { isAdmin } = usePagePermissions();
  const { logout } = useAuthContext();

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

  // Si pas de profil, afficher un bouton de connexion
  if (!profile) {
    return (
      <Button 
        variant="outline" 
        className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg z-50 p-0"
        onClick={() => navigate("/login")}
      >
        <UserCircle2 className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg z-50 p-0"
        >
          <div className="relative">
            <Avatar className="h-12 w-12">
              <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.full_name || "Avatar"} />
              <AvatarFallback>
                {(profile?.full_name || "?")[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {profile?.profile_type === "pro" && (
              <Badge 
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-[0.6rem] font-bold px-2 py-0.5 rounded-full border-[1.5px] border-white shadow-sm"
              >
                Pro
              </Badge>
            )}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="top" sideOffset={10} className="w-[240px]">
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

        <DropdownMenuItem className="cursor-pointer text-destructive" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Se déconnecter</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
