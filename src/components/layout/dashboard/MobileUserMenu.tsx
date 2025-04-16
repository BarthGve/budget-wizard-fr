
import { useAuthContext } from "@/context/AuthProvider";
import { UserDropdown } from "../UserDropdown";
import { Profile } from "@/types/profile";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useProfileFetcher } from "@/components/dashboard/dashboard-tab/ProfileFetcher";
import { useColorPalette } from "@/hooks/color-palette";

interface MobileUserMenuProps {
  profile?: Profile & { isAdmin?: boolean };
  isLoading?: boolean;
}

// Composant pour le menu utilisateur flottant sur mobile
export const MobileUserMenu = ({ 
  profile: providedProfile,
  isLoading: isLoadingProp = false
}: MobileUserMenuProps) => {
  const isMobile = useIsMobile();
  const { isAuthenticated, loading: authLoading, user } = useAuthContext();
  const [initialized, setInitialized] = useState(false);
  const { data: fetchedProfile, isLoading: isProfileLoading } = useProfileFetcher();
  const queryClient = useQueryClient();
  const { loadColorPalette } = useColorPalette();
  
  // Utiliser soit le profil fourni en prop, soit le profil récupéré par le hook
  const profile = providedProfile || fetchedProfile;
  
  // Calculer l'état de chargement global
  const isLoading = isLoadingProp || authLoading || isProfileLoading;
  
  // Charger les couleurs lorsque l'utilisateur change
  useEffect(() => {
    if (user?.id && isAuthenticated) {
      console.log("MobileUserMenu: Chargement des couleurs pour l'utilisateur", user.id);
      loadColorPalette();
    }
  }, [user?.id, isAuthenticated, loadColorPalette]);
  
  // S'assurer que nous avons un état d'initialisation cohérent
  useEffect(() => {
    if (!authLoading) {
      setInitialized(true);
    }
  }, [authLoading]);

  // Forcer un rafraîchissement du profil si l'utilisateur est authentifié mais que nous n'avons pas de profil
  useEffect(() => {
    if (initialized && isAuthenticated && user && !profile && !isProfileLoading) {
      console.log("MobileUserMenu: Tentative de récupération forcée du profil");
      queryClient.invalidateQueries({ queryKey: ["current-profile"] });
    }
  }, [initialized, isAuthenticated, user, profile, isProfileLoading, queryClient]);
  
  // Ne rien afficher si nous ne sommes pas sur mobile
  if (!isMobile) return null;
  
  return (
    <div 
      className={cn(
        "fixed top-4 right-4 z-50 ios-top-safe"
      )}
    >
      <UserDropdown 
        collapsed={true}
        profile={profile}
        isLoading={isLoading}
        isAuthenticated={isAuthenticated}
      />
    </div>
  );
};
