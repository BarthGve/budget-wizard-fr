
import { VehiclesContainer } from "@/components/vehicles/VehiclesContainer";
import { SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

const Vehicles = () => {
  return (
    <div className="min-h-screen w-full page-transition">
      <SidebarProvider>
        <TooltipProvider>
          <div className="w-full">
            <VehiclesContainer />
          </div>
        </TooltipProvider>
      </SidebarProvider>
    </div>
  );
};

export default Vehicles;
