
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useParams } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useVehicleDetail } from "@/hooks/useVehicleDetail";
import { useState } from "react";
import { VehicleForm, VehicleFormValues } from "@/components/vehicles/VehicleForm";
import { useVehicles } from "@/hooks/useVehicles";
import { usePagePermissions } from "@/hooks/usePagePermissions";
import { motion } from "framer-motion";
import { useVehicleBrandLogo } from "@/hooks/useVehicleBrandLogo";
import { VehicleDetailHeader } from "@/components/vehicles/detail/VehicleDetailHeader";
import { VehicleDetailLoading } from "@/components/vehicles/detail/VehicleDetailLoading";
import { VehicleNotFound } from "@/components/vehicles/detail/VehicleNotFound";
import { VehicleDetailTabs } from "@/components/vehicles/detail/VehicleDetailTabs";

const VehicleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { vehicle, isLoading } = useVehicleDetail(id || "");
  const { updateVehicle, isUpdating } = useVehicles();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { canAccessFeature } = usePagePermissions();
  
  // Vérifier si l'utilisateur a accès aux dépenses des véhicules
  const canAccessExpenses = canAccessFeature('/vehicles', 'vehicles_expenses');

  // Important: Nous initialisons le hook avec une chaîne vide par défaut, plutôt que de le mettre dans une condition
  const { previewLogoUrl, isLogoValid, isCheckingLogo } = useVehicleBrandLogo(vehicle?.brand || "");
  
  if (isLoading) {
    return <VehicleDetailLoading />;
  }

  if (!vehicle) {
    return <VehicleNotFound />;
  }

  const handleUpdate = (data: VehicleFormValues) => {
    if (vehicle) {
      updateVehicle({
        id: vehicle.id,
        ...data
      });
      setIsEditDialogOpen(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  return (
    <DashboardLayout>
      <motion.div 
        className="space-y-6"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <VehicleDetailHeader 
          vehicle={vehicle}
          previewLogoUrl={previewLogoUrl}
          isLogoValid={isLogoValid}
          isCheckingLogo={isCheckingLogo}
          onEditClick={() => setIsEditDialogOpen(true)}
        />

        <VehicleDetailTabs 
          vehicle={vehicle}
          canAccessExpenses={canAccessExpenses}
        />
      </motion.div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Modifier le véhicule</DialogTitle>
          </DialogHeader>
          <VehicleForm
            vehicle={vehicle}
            onSubmit={handleUpdate}
            onCancel={() => setIsEditDialogOpen(false)}
            isPending={isUpdating}
          />
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default VehicleDetail;
