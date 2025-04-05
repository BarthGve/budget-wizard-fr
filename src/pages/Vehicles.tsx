
import { VehiclesContainer } from "@/components/vehicles/VehiclesContainer";
import { SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";

const Vehicles = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen w-full page-transition">
      <SidebarProvider>
        <TooltipProvider>
          <div className="w-full">
            <VehiclesContainer />
            {/* Zone de sécurité en bas pour éviter que les boutons flottants ne masquent le contenu */}
            {isMobile && <div className="h-24 ios-bottom-safe floating-button-zone" />}
          </div>
        </TooltipProvider>
      </SidebarProvider>
    </div>
  );
};

export default Vehicles;
