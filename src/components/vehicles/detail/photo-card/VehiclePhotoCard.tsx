
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Vehicle } from "@/types/vehicle";
import { motion } from "framer-motion";
import { VehiclePhotoDisplay } from "./VehiclePhotoDisplay";
import { VehiclePhotoPlaceholder } from "./VehiclePhotoPlaceholder";
import { cn } from "@/lib/utils";

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

export const VehiclePhotoCard = ({
  vehicle
}: VehiclePhotoCardProps) => {
  return (
    <motion.div variants={itemVariants}>
      <Card className={cn(
        "overflow-hidden border shadow-md hover:shadow-lg transition-all duration-200",
        "bg-gradient-to-br from-purple-50 to-purple-100",
        "dark:from-purple-900/20 dark:to-purple-800/10"
      )}>
        <CardHeader className="pb-2">
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
