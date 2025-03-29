
import { Vehicle } from "@/types/vehicle";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PencilIcon, TrashIcon, CalendarIcon, TagIcon, Fuel, ArrowRightIcon } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { FUEL_TYPES } from "@/types/vehicle";
import { useVehicleBrandLogo } from "@/hooks/useVehicleBrandLogo";
import { BrandLogoPreview } from "./BrandLogoPreview";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

// Fonction helper pour obtenir le label du type de carburant
export const getFuelTypeLabel = (value: string) => {
  const fuelType = FUEL_TYPES.find(type => type.value === value);
  return fuelType ? fuelType.label : value;
};

type VehicleCardProps = { 
  vehicle: Vehicle; 
  onEdit: (vehicle: Vehicle) => void; 
  onDelete: (vehicle: Vehicle) => void;
  onClick: (id: string) => void;
  isDeleting: boolean;
  index?: number;
  isVisible?: boolean;
};

export const VehicleCard = ({ 
  vehicle, 
  onEdit, 
  onDelete,
  onClick,
  isDeleting,
  index = 0,
  isVisible = true
}: VehicleCardProps) => {
  const { previewLogoUrl, isLogoValid } = useVehicleBrandLogo(vehicle.brand);
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  
  // Animation variants for card appearance
  const cardVariants = {
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.5,
        delay: index * 0.05
      }
    },
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.3
      }
    }
  };
  
  // Détermine les classes CSS pour le statut du véhicule
  const getStatusBadgeStyles = (status: string) => {
    switch (status) {
      case 'actif':
        return {
          badge: "bg-gradient-to-r from-green-50/80 to-green-100/70 dark:from-green-900/20 dark:to-green-800/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800/40",
          indicator: "bg-green-500"
        };
      case 'inactif':
        return {
          badge: "bg-gradient-to-r from-amber-50/80 to-amber-100/70 dark:from-amber-900/20 dark:to-amber-800/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/40",
          indicator: "bg-amber-500"
        };
      case 'vendu':
        return {
          badge: "bg-gradient-to-r from-gray-50/80 to-gray-100/70 dark:from-gray-800/20 dark:to-gray-700/30 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700/40",
          indicator: "bg-gray-500"
        };
      default:
        return {
          badge: "bg-gradient-to-r from-gray-50/80 to-gray-100/70 dark:from-gray-800/20 dark:to-gray-700/30 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700/40",
          indicator: "bg-gray-500"
        };
    }
  };

  const statusStyles = getStatusBadgeStyles(vehicle.status);
  
  return (
    <motion.div
      className="perspective-1000 h-full pb-4"
      variants={cardVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      whileHover={{ 
        scale: 1.02,
        y: -5,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
    >
      <Card 
        className={cn(
          "vehicle-card backface-hidden transform-gpu h-full overflow-hidden relative cursor-pointer",
          "border border-gray-200/70 hover:border-gray-300/80 vehicle-card-hover",
          "dark:border-gray-700/50 dark:hover:border-gray-600/70",
          "bg-white dark:bg-gray-900/95"
        )}
        style={{
          boxShadow: isDarkMode
            ? "0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 5px 15px -5px rgba(0, 0, 0, 0.1)"
            : "0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 5px 15px -5px rgba(0, 0, 0, 0.05)"
        }}
        onClick={() => onClick(vehicle.id)}
      >
        {vehicle.photo_url && (
          <div className="vehicle-card-image-container">
            <img
              src={vehicle.photo_url}
              alt={`${vehicle.brand} ${vehicle.model}`}
              className="vehicle-card-image"
            />
            <div className="absolute top-3 right-3 z-10">
              <Badge 
                className={cn(
                  "px-3 py-1.5 rounded-md flex items-center gap-2 shadow-sm border",
                  statusStyles.badge
                )}
                variant="outline"
              >
                <span className={cn(
                  "w-2 h-2 rounded-full",
                  statusStyles.indicator
                )} />
                {vehicle.status === 'actif' && "Actif"}
                {vehicle.status === 'inactif' && "Inactif"}
                {vehicle.status === 'vendu' && "Vendu"}
              </Badge>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/40 to-transparent"></div>
          </div>
        )}
        
        <CardHeader className={cn(
          "pb-3 pt-4 relative",
          vehicle.photo_url ? "pt-0 -mt-10 z-10" : "",
        )}>
          <div className={cn(
            "flex items-center gap-3",
            vehicle.photo_url && "text-white"
          )}>
            <div className={cn(
              "flex-shrink-0 w-12 h-12 rounded-full overflow-hidden",
              vehicle.photo_url && "border-2 border-white shadow-md"
            )}>
              <BrandLogoPreview 
                url={previewLogoUrl}
                isValid={isLogoValid}
                isChecking={false}
                brand={vehicle.brand}
              />
            </div>
            <CardTitle className={cn(
              "text-xl font-bold",
              vehicle.photo_url 
                ? "text-white drop-shadow-md" 
                : "text-gray-800 dark:text-gray-100"
            )}>
              {vehicle.model || vehicle.brand}
            </CardTitle>
          </div>
          
          {!vehicle.photo_url && (
            <div className="absolute top-3 right-3">
              <Badge 
                className={cn(
                  "px-3 py-1.5 rounded-md flex items-center gap-2 shadow-sm border",
                  statusStyles.badge
                )}
                variant="outline"
              >
                <span className={cn(
                  "w-2 h-2 rounded-full", 
                  statusStyles.indicator
                )} />
                {vehicle.status === 'actif' && "Actif"}
                {vehicle.status === 'inactif' && "Inactif"}
                {vehicle.status === 'vendu' && "Vendu"}
              </Badge>
            </div>
          )}
        </CardHeader>
        
        <CardContent className={cn(
          "vehicle-card-body px-4 pb-3 space-y-4",
          vehicle.photo_url ? "pt-1" : "pt-0"
        )}>
          <div className="vehicle-card-info-grid">
            <div className="vehicle-card-info-item bg-gray-50/80 dark:bg-gray-800/50">
              <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">Immatriculation</span>
              <div className="flex items-center gap-1.5">
                <TagIcon className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {vehicle.registration_number}
                </span>
              </div>
            </div>
            
            <div className="vehicle-card-info-item bg-gray-50/80 dark:bg-gray-800/50">
              <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">Date d'acquisition</span>
              <div className="flex items-center gap-1.5">
                <CalendarIcon className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {format(new Date(vehicle.acquisition_date), 'dd MMM yyyy', { locale: fr })}
                </span>
              </div>
            </div>
            
            <div className="vehicle-card-info-item bg-gray-50/80 dark:bg-gray-800/50">
              <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">Carburant</span>
              <div className="flex items-center gap-1.5">
                <Fuel className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {getFuelTypeLabel(vehicle.fuel_type)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className={cn(
          "vehicle-card-footer flex justify-between items-center px-4 py-3 mt-auto",
          "bg-gray-50/90 dark:bg-gray-800/40"
        )}>
          <Button
            variant="default"
            size="sm"
            className={cn(
              "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800",
              "dark:from-gray-700 dark:to-gray-800 dark:hover:from-gray-600 dark:hover:to-gray-700",
              "text-white shadow-sm"
            )}
            onClick={(e) => {
              e.stopPropagation();
              onClick(vehicle.id);
            }}
          >
            <span className="mr-1">Détails</span>
            <ArrowRightIcon className="h-3.5 w-3.5" />
          </Button>
          
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(vehicle);
              }}
            >
              <PencilIcon className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="destructive"
              className="bg-red-500/10 text-red-600 hover:bg-red-500/20 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(vehicle);
              }}
              disabled={isDeleting}
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};
