
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Vehicle, FUEL_TYPES } from "@/types/vehicle";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Info, CircleCheck, Clock, Tag, Calendar, Fuel, BarChart } from 'lucide-react';
import { useTheme } from "next-themes";

interface VehicleGeneralInfoProps {
  vehicle: Vehicle;
}

export const VehicleGeneralInfo = ({ vehicle }: VehicleGeneralInfoProps) => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  
  const getFuelTypeLabel = (value: string) => {
    const fuelType = FUEL_TYPES.find(type => type.value === value);
    return fuelType ? fuelType.label : value;
  };
  
  // Fonction pour extraire le nom de domaine (sans l'extension)
  const getBrandName = (brand: string) => {
    // Retirer l'extension de domaine (.com, .fr, etc.)
    return brand.split('.')[0];
  };
  
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

  // Fonction pour obtenir le style de statut
  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'actif':
        return "text-green-500 dark:text-green-400 flex items-center gap-1.5 font-medium";
      case 'inactif':
        return "text-amber-500 dark:text-amber-400 flex items-center gap-1.5 font-medium";
      case 'vendu':
        return "text-gray-500 dark:text-gray-400 flex items-center gap-1.5 font-medium";
      default:
        return "text-gray-500 dark:text-gray-400 flex items-center gap-1.5 font-medium";
    }
  };
  
  // Définir les informations à afficher avec leurs icônes
  const vehicleInfoItems = [
    {
      label: "Marque",
      value: getBrandName(vehicle.brand),
      icon: <Tag className="h-4 w-4 text-gray-500 dark:text-gray-400" />
    },
    {
      label: "Modèle",
      value: vehicle.model || "-",
      icon: <BarChart className="h-4 w-4 text-gray-500 dark:text-gray-400" />
    },
    {
      label: "Immatriculation",
      value: vehicle.registration_number,
      icon: <Tag className="h-4 w-4 text-gray-500 dark:text-gray-400" />
    },
    {
      label: "Statut",
      value: (
        <span className={getStatusStyles(vehicle.status)}>
          <span className={cn(
            "w-2 h-2 rounded-full",
            vehicle.status === 'actif' && "bg-green-500",
            vehicle.status === 'inactif' && "bg-amber-500",
            vehicle.status === 'vendu' && "bg-gray-500"
          )} />
          {vehicle.status === 'actif' && "Actif"}
          {vehicle.status === 'inactif' && "Inactif"}
          {vehicle.status === 'vendu' && "Vendu"}
        </span>
      ),
      icon: <CircleCheck className="h-4 w-4 text-gray-500 dark:text-gray-400" />
    },
    {
      label: "Date d'acquisition",
      value: format(new Date(vehicle.acquisition_date), 'dd MMMM yyyy', { locale: fr }),
      icon: <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
    },
    {
      label: "Type de carburant",
      value: getFuelTypeLabel(vehicle.fuel_type),
      icon: <Fuel className="h-4 w-4 text-gray-500 dark:text-gray-400" />
    }
  ];

  return (
    <motion.div 
      variants={itemVariants}
      initial="hidden"
      animate="visible"
    >
      <Card className={cn(
        "border overflow-hidden h-full",
        "bg-white border-gray-200 hover:border-gray-300",
        "dark:bg-gray-900 dark:border-gray-800 dark:hover:border-gray-700",
        vehicle.status === 'vendu' && "border-gray-300 dark:border-gray-700 relative"
      )}
      style={{
        boxShadow: isDarkMode
          ? "0 4px 20px -4px rgba(0, 0, 0, 0.2), 0 1px 3px -1px rgba(0, 0, 0, 0.2)"
          : "0 4px 20px -4px rgba(100, 100, 100, 0.15), 0 1px 3px -1px rgba(0, 0, 0, 0.05)"
      }}>
        {/* Overlay pour les véhicules vendus */}
        {vehicle.status === 'vendu' && (
          <div className="absolute top-0 right-0 z-10 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-3 py-1 text-xs font-medium rounded-bl-md">
            Véhicule vendu
          </div>
        )}
        
        <CardHeader className={cn(
          "pb-2 border-b",
          "bg-gradient-to-r from-gray-50 to-gray-100/50",
          "dark:bg-gradient-to-r dark:from-gray-900 dark:to-gray-800/40",
          "border-gray-200 dark:border-gray-800"
        )}>
          <CardTitle className="text-xl flex items-center gap-2 text-gray-800 dark:text-gray-100">
            <div className="p-1.5 rounded-md bg-gray-200/80 dark:bg-gray-700/50">
              <Info className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </div>
            Informations générales
          </CardTitle>
        </CardHeader>
        
        <CardContent className={cn(
          "space-y-4 p-4",
          "bg-gradient-to-b from-white to-gray-50/30",
          "dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-800/10"
        )}>
          <div className={cn(
            "grid gap-4",
            "sm:grid-cols-2"
          )}>
            {vehicleInfoItems.map((item, index) => (
              <div 
                key={index} 
                className={cn(
                  "p-3 rounded-lg flex flex-col",
                  "bg-gray-50 dark:bg-gray-800/50",
                  "border border-gray-200/60 dark:border-gray-700/40"
                )}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  {item.icon}
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{item.label}</p>
                </div>
                <div className={typeof item.value === 'string' 
                  ? "font-medium text-gray-800 dark:text-gray-200 capitalize" 
                  : ""
                }>
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
