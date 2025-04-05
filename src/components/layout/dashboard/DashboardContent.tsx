
import { ReactNode, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { GlobalBalanceCard } from "../../common/GlobalBalanceCard";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { BadgeEuro } from "lucide-react";
import { FloatingActionButton } from "@/components/dashboard/floating-action-button";

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
  const [openDrawer, setOpenDrawer] = useState(false);
  
  // Mise en cache du contenu pour éviter les re-renders inutiles
  const MemoizedContent = useMemo(() => (
    <main className="flex-1 flex flex-col h-screen touch-scroll">
      {!isAdmin && !isMobile && (
        <div className={cn(
          "fixed z-40 right-10  top-4"
        )}>
          <GlobalBalanceCard 
            balance={globalBalance} 
            className="shadow-lg"
          />
        </div>
      )}

      {!isAdmin && isMobile && (
        <Drawer open={openDrawer} onOpenChange={setOpenDrawer}>
          <DrawerTrigger asChild>

            <Button 
              size="sm" 
              variant="outline" 
              className="fixed h-14 w-14  z-40 left-5 bottom-40 ios-top-safe rounded-full shadow-md"
            >
              <BadgeEuro className="h-12 w-12" />
            </Button>
          </DrawerTrigger>
          <DrawerContent className="p-4">
            <div className="mx-auto w-full max-w-sm">
              <GlobalBalanceCard 
                balance={globalBalance} 
                className="w-full" 
              />
            </div>
          </DrawerContent>
        </Drawer>
      )}

      <div className={cn(
        "flex-1 container mx-auto p-6 overflow-auto relative",
        isMobile ? "ios-top-safe pt-14" : "pt-20"
      )}>
        <div className="page-transition">
          {children}
        </div>
      </div>

      {/* Bouton d'action flottant sur mobile uniquement */}
      {isMobile && <FloatingActionButton />}

      {isMobile && <div className="h-10 ios-bottom-safe floating-button-zone" />}
    </main>
  ), [isAdmin, isMobile, globalBalance, children, openDrawer]);

  return MemoizedContent;
};
