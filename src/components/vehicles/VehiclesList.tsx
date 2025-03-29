import { Vehicle } from "@/types/vehicle";
import { useState } from "react";
import { useVehicles } from "@/hooks/useVehicles";
import { VehicleFormValues } from "@/components/vehicles/VehicleForm";
import { useNavigate } from "react-router-dom";
import { VehicleDeleteDialog } from "./VehicleDeleteDialog";
import { SoldVehiclesList } from "./SoldVehiclesList";
import { ActiveVehiclesGrid } from "./ActiveVehiclesGrid";
import { VehicleEditDialog } from "./VehicleEditDialog";

export const VehiclesList = () => {
  const { 
    vehicles, 
    isLoading, 
    updateVehicle, 
    isUpdating, 
    deleteVehicle, 
    isDeleting,
    markVehicleAsSold,
    isMarking
  } = useVehicles();
  
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const navigate = useNavigate();

  const handleEdit = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsEditDialogOpen(true);
  };

  const handleUpdate = (data: VehicleFormValues) => {
    if (selectedVehicle) {
      updateVehicle({
        id: selectedVehicle.id,
        ...data
      });
      setIsEditDialogOpen(false);
    }
  };

  const handleDeleteClick = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedVehicle) {
      deleteVehicle(selectedVehicle.id);
    }
  };

  const handleMarkAsSold = () => {
    if (selectedVehicle) {
      markVehicleAsSold(selectedVehicle.id);
    }
  };

  const handleVehicleClick = (vehicleId: string) => {
    navigate(`/vehicles/${vehicleId}`);
  };

  return (
    <>
      <ActiveVehiclesGrid 
        vehicles={vehicles || []}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        onVehicleClick={handleVehicleClick}
        isDeleting={isDeleting || isMarking}
      />
      
      <SoldVehiclesList vehicles={vehicles || []} onVehicleClick={handleVehicleClick} />

      <VehicleEditDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        selectedVehicle={selectedVehicle}
        onUpdate={handleUpdate}
        isPending={isUpdating}
      />
      
      <VehicleDeleteDialog 
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        isPending={isDeleting}
        vehicleBrand={selectedVehicle?.brand}
        vehicleModel={selectedVehicle?.model}
      />
    </>
  );
};
