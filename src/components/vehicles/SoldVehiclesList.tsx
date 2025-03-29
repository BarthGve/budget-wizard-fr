
import { Vehicle } from "@/types/vehicle";
import { Card, CardContent } from "@/components/ui/card";
import { Car } from "lucide-react";
import { VehicleCard } from "./card/VehicleCard";
import { motion } from "framer-motion";

type SoldVehiclesListProps = {
  vehicles: Vehicle[];
  onVehicleClick?: (id: string) => void;
  onEdit?: (vehicle: Vehicle) => void;
  onDelete?: (vehicle: Vehicle) => void;
};

export const SoldVehiclesList = ({ 
  vehicles, 
  onVehicleClick, 
  onEdit, 
  onDelete 
}: SoldVehiclesListProps) => {
  // Filtrer pour n'afficher que les véhicules vendus
  const soldVehicles = vehicles.filter(v => v.status === "vendu");
  
  // Fonctions factices pour les actions d'édition/suppression si non fournies
  const handleEdit = onEdit || (() => {});
  const handleDelete = onDelete || (() => {});
  
  if (soldVehicles.length === 0) {
    return (
      <Card className="overflow-hidden border-dashed border-2 border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/30">
        <CardContent className="p-6 flex flex-col items-center justify-center text-center h-[200px]">
          <Car className="h-12 w-12 text-gray-400 mb-3" />
          <h3 className="text-base font-medium text-gray-600 dark:text-gray-400 mb-1">
            Aucun véhicule vendu
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Les véhicules marqués comme vendus apparaîtront ici
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="w-full">
      {/* Grille pour les véhicules vendus */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {soldVehicles.map((vehicle, index) => (
          <motion.div
            key={vehicle.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <VehicleCard
              vehicle={vehicle}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onClick={(id) => onVehicleClick && onVehicleClick(id)}
              isDeleting={false}
              index={index}
              isVisible={true}
              isSold={true}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};
