
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
  
  console.log("SidebarContent rendering, profile:", profile ? "loaded" : "not loaded");

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

  // Préparer une valeur de profil par défaut pour éviter les erreurs
  const defaultProfile: Profile = {
    id: "",
    email: "",
    full_name: "",
    avatar_url: null,
    created_at: null,
    updated_at: null,
    color_palette: null,
    encryption_enabled: null,
    has_added_data: false,
    isAdmin: false,
    profile_settings: null,
    welcome_completed: false,
    dashboard_preferences: null,
    subscription_tier: "basic"
  };

  // Transformer le profil pour s'assurer que dashboard_preferences est du bon type
  let transformedProfile: Profile | undefined;
  
  if (profile) {
    let dashboard_prefs = null;
    
    // Vérifier si dashboard_preferences existe et le convertir si nécessaire
    if (profile.dashboard_preferences) {
      try {
        dashboard_prefs = typeof profile.dashboard_preferences === 'string' 
          ? JSON.parse(profile.dashboard_preferences) 
          : mergeDashboardPreferences(profile.dashboard_preferences);
      } catch (e) {
        console.error("Erreur lors de la conversion des préférences:", e);
        dashboard_prefs = null;
      }
    }
    
    transformedProfile = {
      ...profile,
      dashboard_preferences: dashboard_prefs
    };
  } else {
    transformedProfile = defaultProfile;
  }

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
