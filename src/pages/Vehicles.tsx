
import { VehiclesContainer } from "@/components/vehicles/VehiclesContainer";
import { SidebarProvider } from "@/components/ui/sidebar";

const Vehicles = () => {
  return (
    <div className="min-h-screen w-full page-transition">
      <SidebarProvider>
        <div className="w-full">
          <VehiclesContainer />
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Vehicles;
