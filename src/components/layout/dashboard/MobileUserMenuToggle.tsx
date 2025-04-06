
import { useCallback } from "react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, UserCircle2, Sun, Moon, Monitor } from "lucide-react";
import { useAuthContext } from "@/context/AuthProvider";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { Profile } from "@/types/profile";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface MobileUserMenuToggleProps {
  profile?: Profile;
}

// Composant pour le bouton d'accès au menu utilisateur sur mobile
export const MobileUserMenuToggle = ({ profile }: MobileUserMenuToggleProps) => {
  const navigate = useNavigate();
  const { logout } = useAuthContext();
  const { setTheme } = useTheme();

  // Fonction pour appliquer le thème avec une animation de transition
  const applyTheme = useCallback((newTheme: string) => {
    setTheme(newTheme);
    
    // Ajouter une classe pour forcer le rafraîchissement du rendu
    document.documentElement.classList.add('theme-updated');
    
    // Supprimer la classe après l'animation
    setTimeout(() => {
      document.documentElement.classList.remove('theme-updated');
    }, 100);
    
    console.log("Thème appliqué:", newTheme);
  }, [setTheme]);

  const handleLogout = async () => {
    try {
      console.log("Déconnexion...");
      await logout();
    } catch (error) {
      console.error("Erreur de déconnexion:", error);
    }
  };

  // Si pas de profil, ne pas afficher le bouton
  if (!profile) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="fixed right-4 top-4 z-50 rounded-full shadow-lg bg-background hover:bg-accent ios-top-safe w-10 h-10 border hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 flex items-center justify-center"
          style={{
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <div className="relative">
            <Avatar className="h-9 w-9">
              <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.full_name || "Avatar"} />
              <AvatarFallback>
                {(profile?.full_name || "?")[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {profile?.profile_type === "pro" && (
              <Badge 
                className={cn(
                  "absolute -bottom-1 -right-1 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-[0.5rem] font-bold px-1 py-0 rounded-full border-[1px] border-white shadow-sm"
                )}>
                Pro
              </Badge>
            )}
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="bottom" sideOffset={10} className="w-[240px]">
        <div className="flex items-center gap-3 p-2 border-b">
          <Avatar className="h-12 w-12">
            <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.full_name || "Avatar"} />
            <AvatarFallback>
              {(profile?.full_name || "?")[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium text-sm">{profile?.full_name || "Utilisateur"}</span>
            <span className="text-xs text-muted-foreground">{profile?.email}</span>
          </div>
        </div>
        
        <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/user-settings")}>
          <UserCircle2 className="mr-2 h-4 w-4" />
          <span>Mon compte</span>
        </DropdownMenuItem>

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
