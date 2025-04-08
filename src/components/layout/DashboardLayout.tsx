
import { useState, ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect } from "react";
import { MobileSidebarToggle } from "./dashboard/MobileSidebarToggle";
import { MobileSidebarOverlay } from "./dashboard/MobileSidebarOverlay";
import { DashboardContent } from "./dashboard/DashboardContent";
import { useDashboardPageData } from "./dashboard/useDashboardData";
import { useRealtimeUpdates } from "./dashboard/useRealtimeUpdates";
import { memo } from "react";
import { MobileUserMenu } from "./dashboard/MobileUserMenu";
import { Profile } from "@/types/profile"; // Ajout de l'import pour le type Profile

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
    // Utiliser un délai plus court pour accélérer le chargement
    const timeoutId = setTimeout(() => {
      refetch();
    }, 100);

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

  // Gérer les erreurs potentielles du layout
  try {
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
      </div>
    );
  } catch (error) {
    console.error("Erreur dans le DashboardLayout:", error);
    // Fallback UI en cas d'erreur
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Erreur de chargement</h2>
          <p className="text-gray-600 mb-6">Un problème est survenu lors du chargement de l'interface.</p>
          <button 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => window.location.reload()}
          >
            Actualiser la page
          </button>
        </div>
      </div>
    );
  }
};
