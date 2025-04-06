
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { SidebarNavigation } from "./SidebarNavigation";
import { SidebarFooter } from "../SidebarFooter";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SidebarLogo } from "./SidebarLogo";
import { useUserData } from "./useUserData";
import { DashboardPreferences, Profile } from "@/types/profile";
import { mergeDashboardPreferences } from "@/utils/dashboard-preferences";

// Définir les dimensions de la sidebar
const EXPANDED_WIDTH = "240px";
const COLLAPSED_WIDTH = "70px";

export interface SidebarContentProps {
  onClose?: () => void;
  isAdmin?: boolean;
  userId?: string;
  onItemClick?: () => void;
}

// Composant principal du contenu de la sidebar
export const SidebarContent = ({ onClose, isAdmin, userId, onItemClick }: SidebarContentProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, isLoading } = useUserData();

  // Fonction pour basculer l'état de la sidebar
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  // Effet pour fermer la sidebar sur mobile quand la route change
  useEffect(() => {
    if (onClose) {
      onClose();
    }
  }, [location.pathname, onClose]);

  // Fonction pour gérer le clic sur un élément de navigation
  const handleNavItemClick = () => {
    if (onItemClick) {
      onItemClick();
    }
  };

  // Transformer le profil pour s'assurer que dashboard_preferences est du bon type
  const transformedProfile: Profile | undefined = profile ? {
    ...profile,
    dashboard_preferences: profile.dashboard_preferences 
      ? mergeDashboardPreferences(profile.dashboard_preferences)
      : null
  } : undefined;

  return (
    <div
      className={cn(
        "h-full flex flex-col bg-background border-r transition-all duration-300",
        collapsed ? "w-[70px]" : "w-[240px]"
      )}
      style={{ width: collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH }}
    >
      {/* Logo et titre */}
      <div className="p-4 border-b flex items-center justify-between">
        <SidebarLogo collapsed={collapsed} />
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={toggleSidebar}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        <SidebarNavigation 
          collapsed={collapsed} 
          onItemClick={handleNavItemClick}
        />
      </div>

      {/* Pied de page avec profil utilisateur */}
      <SidebarFooter collapsed={collapsed} profile={transformedProfile} isLoading={isLoading} />
    </div>
  );
};
