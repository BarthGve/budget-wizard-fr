
import { useState, ReactNode, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { Toaster } from "@/components/ui/toaster";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileSidebarToggle } from "./dashboard/MobileSidebarToggle";
import { MobileSidebarOverlay } from "./dashboard/MobileSidebarOverlay";
import { DashboardContent } from "./dashboard/DashboardContent";
import { useDashboardPageData } from "./dashboard/useDashboardData";
import { memo } from "react";
import { MobileUserMenuToggle } from "./dashboard/MobileUserMenuToggle";
import { Profile } from "@/types/profile";

// Optimisation avec mémorisation pour éviter les re-renders inutiles
const MemoizedSidebar = memo(Sidebar);

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const isMobile = useIsMobile();
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  
  // Récupérer les données du dashboard
  const { userProfile, globalBalance, refetch, isLoading } = useDashboardPageData();
  
  // Effet pour déclencher une actualisation après le chargement initial
  useEffect(() => {
    // Assurer que les données sont chargées une fois le composant monté
    const timeoutId = setTimeout(() => {
      refetch();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [refetch]);

  // Fonctions de gestion de la sidebar mobile
  const toggleSidebar = () => {
    setShowMobileSidebar(!showMobileSidebar);
  };

  const handleOverlayClick = () => {
    if (isMobile && showMobileSidebar) {
      setShowMobileSidebar(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 ios-top-safe">
      {/* Overlay pour fermer la sidebar sur mobile */}
      <MobileSidebarOverlay 
        showMobileSidebar={showMobileSidebar} 
        onOverlayClick={handleOverlayClick} 
      />
      
      {/* Sidebar - visible conditionnellement sur mobile */}
      <div className={`${isMobile ? (showMobileSidebar ? 'block' : 'hidden') : 'block'} z-50`}>
        <MemoizedSidebar onClose={() => setShowMobileSidebar(false)} />
      </div>

      {/* Bouton de basculement de la sidebar sur mobile */}
      {isMobile && (
        <MobileSidebarToggle toggleSidebar={toggleSidebar} />
      )}
      
      {/* Bouton du menu utilisateur sur mobile */}
      {isMobile && (
        <MobileUserMenuToggle profile={userProfile as Profile} isLoading={isLoading} />
      )}

      {/* Contenu principal */}
      <DashboardContent 
        globalBalance={globalBalance} 
        isAdmin={userProfile?.isAdmin}
        isLoading={isLoading}
      >
        {children}
      </DashboardContent>
      
      <Toaster />
    </div>
  );
};
