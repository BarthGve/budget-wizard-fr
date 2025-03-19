
import { Vehicle } from "@/types/vehicle";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PencilIcon, TrashIcon, CarIcon, CalendarIcon, TagIcon, Fuel } from "lucide-react";
import { useState } from "react";
import { useVehicles } from "@/hooks/useVehicles";
import { VehicleForm, VehicleFormValues } from "@/components/vehicles/VehicleForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import { FUEL_TYPES } from "@/types/vehicle";
import { useVehiclesContainer } from "@/hooks/useVehiclesContainer";

export const VehiclesList = () => {
  const { vehicles, isLoading, updateVehicle, isUpdating, deleteVehicle, isDeleting } = useVehicles();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  
  // Utiliser le store global pour la sélection de véhicule
  const { selectedVehicleId, setSelectedVehicleId } = useVehiclesContainer();

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

  const handleDelete = (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce véhicule ?")) {
      deleteVehicle(id);
    }
  };

  // Gestionnaire de sélection de véhicule qui utilise le store global
  const handleVehicleSelect = (vehicleId: string) => {
    console.log("Sélection du véhicule:", vehicleId);
    if (selectedVehicleId === vehicleId) {
      setSelectedVehicleId(null);
    } else {
      setSelectedVehicleId(vehicleId);
    }
  };

  const getFuelTypeLabel = (value: string) => {
    const fuelType = FUEL_TYPES.find(type => type.value === value);
    return fuelType ? fuelType.label : value;
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="shadow-sm">
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-20" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (!vehicles || vehicles.length === 0) {
    return (
      <div className="text-center p-8">
        <CarIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-semibold">Aucun véhicule</h3>
        <p className="mt-1 text-gray-500">Commencez par ajouter votre premier véhicule.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vehicles?.map((vehicle) => (
          <Card 
            key={vehicle.id} 
            className={`shadow-sm cursor-pointer transition-all ${selectedVehicleId === vehicle.id ? 'ring-2 ring-primary' : ''}`}
            onClick={() => handleVehicleSelect(vehicle.id)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex justify-between">
                <span>
                  {vehicle.brand} {vehicle.model}
                </span>
                <span className="text-sm text-gray-500 font-normal">
                  {vehicle.status === 'actif' && <span className="text-green-500">Actif</span>}
                  {vehicle.status === 'inactif' && <span className="text-yellow-500">Inactif</span>}
                  {vehicle.status === 'vendu' && <span className="text-gray-500">Vendu</span>}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {vehicle.photo_url && (
                <div className="mb-3">
                  <img
                    src={vehicle.photo_url}
                    alt={`${vehicle.brand} ${vehicle.model}`}
                    className="w-full h-32 object-cover rounded-md"
                  />
                </div>
              )}
              <div className="flex items-center text-sm">
                <TagIcon className="mr-2 h-4 w-4 text-gray-500" />
                <span>{vehicle.registration_number}</span>
              </div>
              <div className="flex items-center text-sm">
                <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                <span>Acquisition: {format(new Date(vehicle.acquisition_date), 'dd MMMM yyyy', { locale: fr })}</span>
              </div>
              <div className="flex items-center text-sm">
                <Fuel className="mr-2 h-4 w-4 text-gray-500" />
                <span>Carburant: {getFuelTypeLabel(vehicle.fuel_type)}</span>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(vehicle);
                }}
              >
                <PencilIcon className="h-4 w-4 mr-1" />
                Modifier
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(vehicle.id);
                }}
                disabled={isDeleting}
              >
                <TrashIcon className="h-4 w-4 mr-1" />
                Supprimer
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Modifier le véhicule</DialogTitle>
          </DialogHeader>
          {selectedVehicle && (
            <VehicleForm
              vehicle={selectedVehicle}
              onSubmit={handleUpdate}
              onCancel={() => setIsEditDialogOpen(false)}
              isPending={isUpdating}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
