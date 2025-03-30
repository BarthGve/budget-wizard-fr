
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Vehicle } from "@/types/vehicle";
import { motion } from "framer-motion";
import { VehiclePhotoDisplay } from "./VehiclePhotoDisplay";
import { VehiclePhotoPlaceholder } from "./VehiclePhotoPlaceholder";
import { cn } from "@/lib/utils";
import { Camera } from "lucide-react";
import { useTheme } from "next-themes";

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
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  
  return (
    <motion.div variants={itemVariants}>
      <Card className={cn(
        "border overflow-hidden h-full",
        "bg-white border-gray-200 hover:border-gray-300",
        "dark:bg-gray-900 dark:border-gray-800 dark:hover:border-gray-700"
      )}
      style={{
        boxShadow: isDarkMode
          ? "0 4px 20px -4px rgba(0, 0, 0, 0.2), 0 1px 3px -1px rgba(0, 0, 0, 0.2)"
          : "0 4px 20px -4px rgba(100, 100, 100, 0.15), 0 1px 3px -1px rgba(0, 0, 0, 0.05)"
      }}>
        <CardHeader className={cn(
          "pb-2 border-b",
          "bg-gradient-to-r from-gray-50 to-gray-100/50",
          "dark:bg-gradient-to-r dark:from-gray-900 dark:to-gray-800/40",
          "border-gray-200 dark:border-gray-800"
        )}>
          <CardTitle className="text-xl flex items-center gap-2 text-gray-800 dark:text-gray-100">
            <div className="p-1.5 rounded-md bg-gray-200/80 dark:bg-gray-700/50">
              <Camera className="h-5 w-5 text-gray-600 dark:text-gray-300"/>
            </div>
            Photo du véhicule
          </CardTitle>
        </CardHeader>
        
        <CardContent className={cn(
          "p-4",
          "bg-gradient-to-b from-white to-gray-50/30",
          "dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-800/10"
        )}>
          <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 aspect-video">
            {vehicle.photo_url ? (
              <VehiclePhotoDisplay 
                photoUrl={vehicle.photo_url} 
                brand={vehicle.brand} 
                model={vehicle.model} 
              />
            ) : (
              <VehiclePhotoPlaceholder />
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
