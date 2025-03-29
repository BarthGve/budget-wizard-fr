
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Vehicle } from "@/types/vehicle";
import { BrandLogoPreview } from "@/components/vehicles/BrandLogoPreview";
import { ChevronLeft, PencilIcon } from "lucide-react";
import { motion } from "framer-motion";

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

  return (
    <>
      <motion.div variants={itemVariants}>
        <Link
          to="/vehicles"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Retour aux véhicules
        </Link>
      </motion.div>

      <motion.div 
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        variants={itemVariants}
      >
        <h1 className="flex items-center gap-3 text-3xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          {vehicle && (
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center border-2 border-gray-200 shadow-md overflow-hidden">
              <BrandLogoPreview
                url={previewLogoUrl}
                isValid={isLogoValid}
                isChecking={isCheckingLogo}
                brand={vehicle.brand}
                size="lg"
              />
            </div>
          )}
          <span>{vehicle?.model || vehicle?.brand}</span>
        </h1>
        <Button onClick={onEditClick}>
          <PencilIcon className="mr-2 h-4 w-4" />
          Modifier le véhicule
        </Button>
      </motion.div>
    </>
  );
};
