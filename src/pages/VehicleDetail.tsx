
import { useParams } from "react-router-dom";
import { useVehicleDetail } from "@/hooks/useVehicleDetail";
import { useState } from "react";
import { VehicleFormValues } from "@/components/vehicles/VehicleForm";
import { useVehicles } from "@/hooks/useVehicles";
import { usePagePermissions } from "@/hooks/usePagePermissions";
import { motion } from "framer-motion";
import { useVehicleBrandLogo } from "@/hooks/useVehicleBrandLogo";
import { VehicleDetailHeader } from "@/components/vehicles/detail/VehicleDetailHeader";
import { VehicleDetailLoading } from "@/components/vehicles/detail/VehicleDetailLoading";
import { VehicleNotFound } from "@/components/vehicles/detail/VehicleNotFound";
import { VehicleDetailTabs } from "@/components/vehicles/detail/VehicleDetailTabs";
import { VehicleEditDialog } from "@/components/vehicles/VehicleEditDialog";
import { MobileNavigation } from "@/components/vehicles/detail/MobileNavigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSwipe } from "@/hooks/use-swipe";
import { WithTooltipProvider } from "@/components/providers/TooltipProviders";

const VehicleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { vehicle, isLoading } = useVehicleDetail(id || "");
  const { updateVehicle, isUpdating } = useVehicles();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { canAccessFeature } = usePagePermissions();
  const isMobile = useIsMobile();
  const [activeSection, setActiveSection] = useState("details");
  
  // Vérifier si l'utilisateur a accès aux dépenses des véhicules
  const canAccessExpenses = canAccessFeature('/vehicles', 'vehicles_expenses');

  // Important: Nous initialisons le hook avec une chaîne vide par défaut, plutôt que de le mettre dans une condition
  const { previewLogoUrl, isLogoValid, isCheckingLogo } = useVehicleBrandLogo(vehicle?.brand || "");
  
  // Gestion du swipe pour changer de section sur mobile
  const sectionOrder = ["details", ...(canAccessExpenses ? ["expenses"] : []), "documents"];
  
  const handleSwipeLeft = () => {
    const currentIndex = sectionOrder.indexOf(activeSection);
    if (currentIndex < sectionOrder.length - 1) {
      setActiveSection(sectionOrder[currentIndex + 1]);
    }
  };
  
  const handleSwipeRight = () => {
    const currentIndex = sectionOrder.indexOf(activeSection);
    if (currentIndex > 0) {
      setActiveSection(sectionOrder[currentIndex - 1]);
    }
  };
  
  const swipeHandlers = useSwipe({
    onSwipeLeft: handleSwipeLeft,
    onSwipeRight: handleSwipeRight,
    threshold: 50
  });
  
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
    <WithTooltipProvider>
      {isMobile && (
        <MobileNavigation 
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          canAccessExpenses={canAccessExpenses}
        />
      )}
      
      <motion.div 
        className="space-y-6 pt-16"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        {...swipeHandlers}
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
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
      </motion.div>

      <VehicleEditDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        selectedVehicle={vehicle}
        onUpdate={handleUpdate}
        isPending={isUpdating}
      />
    </WithTooltipProvider>
  );
};

export default VehicleDetail;
