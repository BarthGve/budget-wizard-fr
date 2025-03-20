
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Vehicle } from "@/types/vehicle";
import { motion } from "framer-motion";
import { VehiclePhotoDisplay } from "./VehiclePhotoDisplay";
import { VehiclePhotoPlaceholder } from "./VehiclePhotoPlaceholder";

// Animation variants communs utilisés par ce composant
const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

interface VehiclePhotoCardProps {
  vehicle: Vehicle;
}

export const VehiclePhotoCard = ({ vehicle }: VehiclePhotoCardProps) => {
  return (
    <motion.div variants={itemVariants}>
      <Card>
        <CardHeader>
          <CardTitle>Photo du véhicule</CardTitle>
        </CardHeader>
        <CardContent>
          {vehicle.photo_url ? (
            <VehiclePhotoDisplay 
              photoUrl={vehicle.photo_url} 
              brand={vehicle.brand} 
              model={vehicle.model} 
            />
          ) : (
            <VehiclePhotoPlaceholder />
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
