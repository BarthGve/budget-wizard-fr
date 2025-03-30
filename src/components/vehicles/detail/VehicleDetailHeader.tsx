
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Vehicle } from "@/types/vehicle";
import { BrandLogoPreview } from "@/components/vehicles/BrandLogoPreview";
import { ChevronLeft, PencilIcon, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

interface VehicleDetailHeaderProps {
  vehicle: Vehicle;
  previewLogoUrl: string | null;
  isLogoValid: boolean;
  isCheckingLogo: boolean;
  onEditClick: () => void;
}

export const VehicleDetailHeader = ({
  vehicle,
  previewLogoUrl,
  isLogoValid,
  isCheckingLogo,
  onEditClick
}: VehicleDetailHeaderProps) => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  
  // Animation variants
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
  
  // Fonction pour extraire le nom de domaine (sans l'extension)
  const getBrandName = (brand: string) => {
    // Retirer l'extension de domaine (.com, .fr, etc.)
    return brand.split('.')[0];
  };

  return (
    <motion.div 
      className="mb-6"
      variants={itemVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="mb-4">
        <Link
          to="/vehicles"
          className={cn(
            "inline-flex items-center gap-1.5 text-sm rounded-md p-2 transition-colors",
            "text-gray-600 hover:text-gray-900 hover:bg-gray-100/70",
            "dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800/50"
          )}
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux véhicules
        </Link>
      </motion.div>

      <div className={cn(
        "flex flex-col md:flex-row justify-between items-start md:items-center gap-5",
        "py-3 px-4 rounded-lg",
        "bg-gray-50/60 dark:bg-gray-900/30",
        "border border-gray-200/60 dark:border-gray-800/60"
      )}
      style={{
        boxShadow: isDarkMode
          ? "0 2px 10px -4px rgba(0, 0, 0, 0.1)"
          : "0 2px 10px -4px rgba(100, 100, 100, 0.05)"
      }}>
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-14 h-14 rounded-full flex items-center justify-center overflow-hidden",
            "bg-white dark:bg-gray-800 shadow-sm",
            "border-2 border-gray-200 dark:border-gray-700"
          )}>
            <BrandLogoPreview
              url={previewLogoUrl}
              isValid={isLogoValid}
              isChecking={isCheckingLogo}
              brand={vehicle.brand}
              size="lg"
            />
          </div>
          <div>
            <h1 className={cn(
              "text-2xl md:text-3xl font-bold tracking-tight",
              "bg-gradient-to-r from-gray-700 via-gray-800 to-gray-700 bg-clip-text text-transparent",
              "dark:from-gray-200 dark:via-gray-300 dark:to-gray-200"
            )}>
              {getBrandName(vehicle.brand)} {vehicle?.model}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {vehicle.registration_number}
              <span className="inline-block mx-2 text-gray-400 dark:text-gray-600">•</span>
              {vehicle.fuel_type.charAt(0).toUpperCase() + vehicle.fuel_type.slice(1)}
            </p>
          </div>
        </div>
        <Button 
          onClick={onEditClick}
          className={cn(
            "gap-2 whitespace-nowrap",
            "bg-gray-100 hover:bg-gray-200 text-gray-700",
            "dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300",
            "border border-gray-300 dark:border-gray-600"
          )}
          size="sm"
          variant="outline"
        >
          <PencilIcon className="h-4 w-4" />
          Modifier le véhicule
        </Button>
      </div>
    </motion.div>
  );
};
