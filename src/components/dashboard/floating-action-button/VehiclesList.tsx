
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Car } from "lucide-react";
import { Vehicle } from "@/types/vehicle";

// Animation variants
const menuVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.8 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 20,
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  },
  exit: { 
    opacity: 0, 
    y: 20, 
    scale: 0.8,
    transition: { 
      duration: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.8 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 20
    }
  }
};

interface VehiclesListProps {
  vehicles: Vehicle[];
  isLoading: boolean;
  onVehicleSelect: (id: string) => void;
  onBackClick: () => void;
}

/**
 * Liste des véhicules pour sélection
 */
export const VehiclesList = ({ 
  vehicles, 
  isLoading, 
  onVehicleSelect, 
  onBackClick 
}: VehiclesListProps) => {
  return (
    <motion.div 
      className="flex flex-col items-end gap-2 min-w-52"
      variants={menuVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div variants={itemVariants} className="flex items-center justify-between w-full">
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 px-2 text-xs"
          onClick={onBackClick}
        >
          Retour
        </Button>
        <span className="text-sm font-medium">Sélectionner un véhicule</span>
      </motion.div>
      
      {isLoading ? (
        <motion.div variants={itemVariants} className="w-full p-3 bg-white dark:bg-gray-800 rounded-lg shadow-md text-center">
          Chargement...
        </motion.div>
      ) : vehicles.length === 0 ? (
        <motion.div variants={itemVariants} className="w-full p-3 bg-white dark:bg-gray-800 rounded-lg shadow-md text-center">
          Aucun véhicule disponible
        </motion.div>
      ) : (
        vehicles.map(vehicle => (
          <motion.div 
            key={vehicle.id}
            variants={itemVariants}
            className="w-full flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg shadow-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            onClick={() => onVehicleSelect(vehicle.id)}
          >
            <div className="flex items-center gap-2">
              <Car className="h-4 w-4 text-blue-500" />
              <span className="font-medium">{vehicle.brand} {vehicle.model || ""}</span>
            </div>
            <span className="text-xs text-gray-500">{vehicle.registration_number}</span>
          </motion.div>
        ))
      )}
    </motion.div>
  );
};
