
import { useEffect, useState } from "react";
import { useUserData } from "../sidebar/useUserData";
import { Profile } from "@/types/profile";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/hooks/useAuthContext";

interface MobileUserMenuToggleProps {
  profile?: Profile;
  isLoading?: boolean;
}

export const MobileUserMenuToggle = ({ profile, isLoading = false }: MobileUserMenuToggleProps) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuthContext();

  // Fermer le menu lors d'un changement de route
  useEffect(() => {
    setOpen(false);
  }, [navigate]);

  // Gérer la déconnexion
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  // Afficher un skeleton loader pendant le chargement
  if (isLoading) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full"
          >
            {profile?.avatar_url ? (
              <img 
                src={profile.avatar_url} 
                alt={profile.full_name || "Utilisateur"} 
                className="h-8 w-8 rounded-full"
              />
            ) : (
              <User className="h-5 w-5" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem 
            className="cursor-pointer"
            onClick={() => navigate("/user-settings")}
          >
            Paramètres du compte
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="cursor-pointer text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Se déconnecter
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
