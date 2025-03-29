
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { VehiclesContainer } from "@/components/vehicles/VehiclesContainer";
import { SidebarProvider } from "@/components/ui/sidebar";

const Vehicles = () => {
  return (
    <DashboardLayout>
      <div className="min-h-screen w-full page-transition">
        <SidebarProvider>
          <div className="w-full">
            <VehiclesContainer />
          </div>
        </SidebarProvider>
      </div>
    </DashboardLayout>
  );
};

export default Vehicles;
