
import { VehiclesHeader } from "./VehiclesHeader";
import { VehiclesTabs } from "./VehiclesTabs";
import { motion } from "framer-motion";
import { useVehicles } from "@/hooks/useVehicles";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { VehicleEditDialog } from "./VehicleEditDialog";
import { VehicleDeleteDialog } from "./VehicleDeleteDialog";
import { useState } from "react";
import { Vehicle } from "@/types/vehicle";
import { VehicleFormValues } from "./VehicleForm";

export const VehiclesContainer = () => {
  const { vehicles, isLoading, updateVehicle, isUpdating, deleteVehicle, isDeleting, markVehicleAsSold, isMarking } = useVehicles();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const handleEdit = (vehicle: Vehicle) => {
    console.log("Demande d'édition du véhicule:", vehicle.id);
    setSelectedVehicle(vehicle);
    setIsEditDialogOpen(true);
  };

  const handleUpdate = (data: VehicleFormValues) => {
    if (selectedVehicle) {
      console.log("Mise à jour du véhicule:", selectedVehicle.id);
      updateVehicle({
        id: selectedVehicle.id,
        ...data
      });
      setIsEditDialogOpen(false);
    }
  };

  const handleDeleteClick = (vehicle: Vehicle) => {
    console.log("Demande de suppression du véhicule:", vehicle.id);
    setSelectedVehicle(vehicle);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedVehicle) {
      console.log("Confirmation de suppression du véhicule:", selectedVehicle.id);
      deleteVehicle(selectedVehicle.id);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleMarkAsSold = () => {
    if (selectedVehicle) {
      console.log("Marquer le véhicule comme vendu:", selectedVehicle.id);
      markVehicleAsSold(selectedVehicle.id);
      setIsDeleteDialogOpen(false);
    }
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4
      }
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        "max-w-7xl mx-auto",
        "space-y-8"
      )}
    >
      <VehiclesHeader />
      
      <motion.div
        variants={itemVariants}
        className={cn(
          "bg-white dark:bg-gray-900/50",
          "border border-gray-200 dark:border-gray-800",
          "rounded-xl overflow-hidden",
          "shadow-sm"
        )}
        style={{
          boxShadow: isDarkMode
            ? "0 4px 20px -6px rgba(0, 0, 0, 0.1)"
            : "0 4px 20px -6px rgba(0, 0, 0, 0.05)"
        }}
      >
        <div className="p-6">
          <VehiclesTabs 
            vehicles={vehicles || []}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />
        </div>
      </motion.div>
      
      {/* Dialog de modification */}
      <VehicleEditDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        selectedVehicle={selectedVehicle}
        onUpdate={handleUpdate}
        isPending={isUpdating}
      />
      
      {/* Dialog de suppression/vente */}
      <VehicleDeleteDialog 
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onDelete={handleConfirmDelete}
        onMarkAsSold={handleMarkAsSold}
      />
    </motion.div>
  );
};
