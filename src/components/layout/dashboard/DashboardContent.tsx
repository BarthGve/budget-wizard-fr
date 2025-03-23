
import { ReactNode, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { GlobalBalanceCard } from "../../common/GlobalBalanceCard";

interface DashboardContentProps {
  children: ReactNode;
  globalBalance: number;
  isAdmin?: boolean;
}

// Composant pour le contenu principal du dashboard
export const DashboardContent = ({ 
  children, 
  globalBalance,
  isAdmin = false 
}: DashboardContentProps) => {
  const isMobile = useIsMobile();
  
  // Mise en cache du contenu pour éviter les re-renders inutiles
  const MemoizedContent = useMemo(() => (
    <main className="flex-1 flex flex-col h-screen touch-scroll">
      {!isAdmin && (
        <div className={cn(
          "fixed z-40",
          isMobile ? "right-4 top-16 ios-top-safe" : "right-6 top-4"
        )}>
          <GlobalBalanceCard 
            balance={globalBalance} 
            className="shadow-lg"
          />
        </div>
      )}

      <div className={cn(
        "flex-1 container mx-auto p-6 overflow-auto relative",
        isMobile ? "ios-top-safe pt-24" : "pt-20"
      )}>
        <div className="page-transition">
          {children}
        </div>
      </div>

      {isMobile && <div className="h-16 ios-bottom-safe" />}
    </main>
  ), [isAdmin, isMobile, globalBalance, children]);

  return MemoizedContent;
};
