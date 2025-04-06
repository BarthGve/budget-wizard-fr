
import { useState, ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Toaster } from "@/components/ui/toaster";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect } from "react";
import { MobileSidebarToggle } from "./dashboard/MobileSidebarToggle";
import { MobileSidebarOverlay } from "./dashboard/MobileSidebarOverlay";
import { DashboardContent } from "./dashboard/DashboardContent";
import { useDashboardPageData } from "./dashboard/useDashboardData";
import { useRealtimeUpdates } from "./dashboard/useRealtimeUpdates";
import { memo } from "react";
import { MobileUserMenu } from "./dashboard/MobileUserMenu";

// Optimisation avec mémorisation pour éviter les re-renders inutiles
const MemoizedSidebar = memo(Sidebar);

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const isMobile = useIsMobile();
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  
  // Récupérer les données du dashboard
  const { userProfile, globalBalance, refetch } = useDashboardPageData();
  
  // Configurer les écouteurs de mise à jour en temps réel
  useRealtimeUpdates(refetch);

  // Effet pour déclencher une actualisation après le chargement initial
  useEffect(() => {
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

      {/* Menu utilisateur flottant sur mobile */}
      <MobileUserMenu 
        profile={userProfile as Profile} 
        isLoading={!userProfile}
      />

      {/* Bouton de basculement de la sidebar sur mobile */}
      {isMobile && (
        <MobileSidebarToggle toggleSidebar={toggleSidebar} />
      )}

      {/* Contenu principal */}
      <DashboardContent 
        globalBalance={globalBalance} 
        isAdmin={userProfile?.isAdmin}
      >
        {children}
      </DashboardContent>
      
      <Toaster />
    </div>
  );
};
