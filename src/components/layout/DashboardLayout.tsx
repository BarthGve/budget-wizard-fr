
import { useState, ReactNode, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { Toaster } from "@/components/ui/toaster";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileSidebarToggle } from "./dashboard/MobileSidebarToggle";
import { DashboardContent } from "./dashboard/DashboardContent";
import { useDashboardPageData } from "./dashboard/useDashboardData";
import { useRealtimeUpdates } from "./dashboard/useRealtimeUpdates";
import { memo } from "react";
import { ModernMobileSidebar } from "./dashboard/ModernMobileSidebar";

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

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 ios-top-safe">
      {/* Sidebar Desktop - visible uniquement sur ordinateur */}
      {!isMobile && (
        <div className="z-50">
          <MemoizedSidebar />
        </div>
      )}
      
      {/* Sidebar Mobile Moderne (flottante) */}
      {isMobile && (
        <ModernMobileSidebar 
          isOpen={showMobileSidebar}
          onOpenChange={setShowMobileSidebar}
          userId={userProfile?.id}
          isAdmin={userProfile?.isAdmin}
          profile={userProfile}
        />
      )}

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
