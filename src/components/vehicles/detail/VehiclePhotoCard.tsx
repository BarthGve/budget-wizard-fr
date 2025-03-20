
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Vehicle } from "@/types/vehicle";
import { Car } from "lucide-react";
import { motion } from "framer-motion";

interface VehiclePhotoCardProps {
  vehicle: Vehicle;
}

export const VehiclePhotoCard = ({ vehicle }: VehiclePhotoCardProps) => {
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

  if (vehicle.photo_url) {
    return (
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Photo du véhicule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-video overflow-hidden rounded-md">
              <img
                src={vehicle.photo_url}
                alt={`${vehicle.brand} ${vehicle.model || ""}`}
                className="object-cover w-full h-full"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div variants={itemVariants}>
      <Card>
        <CardHeader>
          <CardTitle>Photo du véhicule</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-48">
          <Car className="h-12 w-12 text-muted-foreground" />
          <p className="mt-2 text-muted-foreground">Aucune photo disponible</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};
