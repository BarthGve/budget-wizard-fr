
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Vehicle } from "@/types/vehicle";
import { motion } from "framer-motion";
import { VehiclePhotoDisplay } from "./VehiclePhotoDisplay";
import { VehiclePhotoPlaceholder } from "./VehiclePhotoPlaceholder";
import { cn } from "@/lib/utils";
import {Camera} from "lucide-react"


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
        "border shadow-sm overflow-hidden",
        "bg-white border-gray-100 dark:bg-gray-800 dark:border-gray-700"
      )}>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center gap-2">
            <div className="p-1.5 rounded bg-gray-100 dark:bg-gray-800/70">
              <Camera className="text-gray-600 dark:text-gray-400"/>
            </div>
            Photo du véhicule
          </CardTitle>
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
