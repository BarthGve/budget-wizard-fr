
import { cn } from "@/lib/utils";
import { SidebarHeader } from "./SidebarHeader";
import { SidebarContent } from "./SidebarContent";
import { SidebarFooter } from "./SidebarFooter";
import { SidebarToggle } from "./SidebarToggle";
import { useSidebar } from "./useSidebar";
import { useUserData } from "./useUserData";
import { Skeleton } from "@/components/ui/skeleton";
import { mergeDashboardPreferences } from "@/utils/dashboard-preferences";

interface SidebarProps {
  className?: string;
  onClose?: () => void;
}

export const Sidebar = ({ className, onClose }: SidebarProps) => {
  // Hooks personnalisés pour la gestion de la sidebar
  const { collapsed, setCollapsed, sidebarRef, isMobile, handleLinkClick } = useSidebar();
  const { currentUser, profile, isAdmin, isLoading } = useUserData();
  
  // Gestion du clic sur les liens dans la sidebar
  const handleSidebarLinkClick = () => {
    handleLinkClick(onClose);
  };

  // Assurer que le profil a les bonnes structures de données
  const processedProfile = profile ? {
    ...profile,
    // Convertir dashboard_preferences si nécessaire
    dashboard_preferences: profile.dashboard_preferences ? 
      mergeDashboardPreferences(profile.dashboard_preferences) : 
      null
  } : undefined;

  return (
    <aside
      ref={sidebarRef}
      className={cn(
        "relative h-screen bg-background border-r rounded-r-xl border-border transition-all duration-300 flex flex-col touch-scroll sidebar-content",
        collapsed ? "w-16" : "w-64",
        isMobile && "fixed z-50 shadow-lg",
        className
      )}
    >
      <div className="flex flex-col h-full ios-top-safe">
        {/* En-tête fixe en haut */}
        <SidebarHeader collapsed={collapsed} />
  
        {/* Contenu principal avec navigation qui s'ajuste automatiquement */}
        <SidebarContent 
          collapsed={collapsed} 
          isAdmin={!!isAdmin} 
          userId={currentUser?.id}
          onItemClick={handleSidebarLinkClick}
        />
        
        {/* Footer avec contrôles du thème et utilisateur */}
        <SidebarFooter 
          collapsed={collapsed} 
          profile={processedProfile} 
          isLoading={isLoading}
        />
      </div>
  
      {/* Bouton pour réduire/agrandir la sidebar (seulement sur desktop) */}
      {!isMobile && (
        <SidebarToggle 
          collapsed={collapsed} 
          onClick={() => setCollapsed(!collapsed)} 
        />
      )}
    </aside>
  );
};
