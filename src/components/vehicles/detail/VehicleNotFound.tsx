
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Car } from "lucide-react";

export const VehicleNotFound = () => {
  return (
    <DashboardLayout>
      <div className="text-center py-12">
        <Car className="mx-auto h-12 w-12 text-gray-400" />
        <h2 className="mt-2 text-lg font-semibold">Véhicule non trouvé</h2>
        <p className="mt-1 text-gray-500">Le véhicule que vous recherchez n'existe pas.</p>
        <Button asChild className="mt-4">
          <Link to="/vehicles">Retour aux véhicules</Link>
        </Button>
      </div>
    </DashboardLayout>
  );
};
