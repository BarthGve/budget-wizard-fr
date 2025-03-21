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
      rotateY: 0,
      y: 0,
      scale: 1,
      height: "auto",
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.6,
        delay: index * 0.05
      }
    },
    hidden: {
      opacity: 0,
      rotateY: -90,
      y: 20,
      scale: 0.8,
      height: 0,
      margin: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.5
      }
    }
  };
  
  // Détermine les classes CSS pour le statut du véhicule
  const getStatusBadgeStyles = (status: string) => {
    switch (status) {
      case 'actif':
        return {
          badge: "bg-gray-800/10 dark:bg-gray-400/20 text-gray-800 dark:text-gray-300 border-gray-600/20 dark:border-gray-500/30 font-medium",
          indicator: "bg-green-500"
        };
      case 'inactif':
        return {
          badge: "bg-gray-800/10 dark:bg-gray-400/20 text-gray-800 dark:text-gray-300 border-gray-600/20 dark:border-gray-500/30 font-medium",
          indicator: "bg-amber-500"
        };
      case 'vendu':
        return {
          badge: "bg-gray-800/10 dark:bg-gray-400/20 text-gray-800 dark:text-gray-300 border-gray-600/20 dark:border-gray-500/30 font-medium",
          indicator: "bg-gray-500"
        };
      default:
        return {
          badge: "bg-gray-800/10 dark:bg-gray-400/20 text-gray-800 dark:text-gray-300 border-gray-600/20 dark:border-gray-500/30 font-medium",
          indicator: "bg-gray-500"
        };
    }
  };

  const statusStyles = getStatusBadgeStyles(vehicle.status);
  
  return (
    <motion.div
      className="perspective-1000 h-full pb-4 overflow-hidden"
      variants={cardVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      whileHover={{ 
        scale: 1.02,
        y: -3,
      }}
      whileTap={{ scale: 0.98 }}
    >
      <Card 
        className={cn(
          "flex flex-col backface-hidden transform-gpu h-full overflow-hidden relative",
          "bg-white border-gray-200 hover:border-gray-300",
          "dark:bg-slate-900 dark:border-gray-800 dark:hover:border-gray-700"
        )}
        style={{
          boxShadow: isDarkMode
            ? "0 4px 20px -4px rgba(0, 0, 0, 0.2), 0 1px 3px -1px rgba(0, 0, 0, 0.2)"
            : "0 4px 20px -4px rgba(100, 100, 100, 0.15), 0 1px 3px -1px rgba(0, 0, 0, 0.05)"
        }}
        onClick={() => onClick(vehicle.id)}
      >
        {vehicle.photo_url && (
          <div className="relative">
            <img
              src={vehicle.photo_url}
              alt={`${vehicle.brand} ${vehicle.model}`}
              className="w-full h-48 object-cover"
            />
            <div className="absolute top-3 right-3">
              <Badge 
                className={cn(
                  "px-3 py-1.5 rounded-md flex items-center gap-2",
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
          </div>
        )}
        
        <CardHeader className="pb-2 pt-4">
          {!vehicle.photo_url && (
            <div className="absolute top-3 right-3">
              <Badge 
                className={cn(
                  "px-3 py-1.5 rounded-md flex items-center gap-2",
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
          
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-12 h-12">
              <BrandLogoPreview 
                url={previewLogoUrl}
                isValid={isLogoValid}
                isChecking={false}
                brand={vehicle.brand}
              />
            </div>
            <CardTitle className={cn(
              "text-xl font-bold",
              "text-gray-800 dark:text-gray-100"
            )}>
              {vehicle.model || vehicle.brand}
            </CardTitle>
          </div>
        </CardHeader>
        
        <CardContent className={cn(
          "flex-1 flex flex-col px-4 pb-3",
          "bg-gradient-to-b from-white to-gray-50/30",
          "dark:bg-gradient-to-b dark:from-slate-900 dark:to-gray-800/10"
        )}>
          <div className={cn(
            "p-4 rounded-md mb-4",
            "bg-gray-100 dark:bg-gray-800/50",
            "border border-gray-200/50 dark:border-gray-700/50"
          )}>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center">
                <TagIcon className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                <span className="text-gray-800 dark:text-gray-200">
                  {vehicle.registration_number}
                </span>
              </div>
              <div className="flex items-center">
                <CalendarIcon className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                <span className="text-gray-800 dark:text-gray-200">
                  {format(new Date(vehicle.acquisition_date), 'dd MMMM yyyy', { locale: fr })}
                </span>
              </div>
              <div className="flex items-center">
                <Fuel className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                <span className="text-gray-800 dark:text-gray-200">
                  {getFuelTypeLabel(vehicle.fuel_type)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className={cn(
          "flex justify-between items-center px-4 py-3",
          "border-t border-gray-200 dark:border-gray-800",
          "bg-gray-50 dark:bg-gray-800/30"
        )}>
          <Button
            size="sm"
            variant="ghost"
            className={cn(
              "gap-1 text-gray-700 dark:text-gray-300",
              "hover:bg-gray-100 dark:hover:bg-gray-800"
            )}
            onClick={(e) => {
              e.stopPropagation();
              onClick(vehicle.id);
            }}
          >
            <span>Détails</span>
            <ArrowRightIcon className="h-4 w-4" />
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
              <PencilIcon className="h-4 w-4 mr-1" />
              Modifier
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
              <TrashIcon className="h-4 w-4 mr-1" />
              Supprimer
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};
