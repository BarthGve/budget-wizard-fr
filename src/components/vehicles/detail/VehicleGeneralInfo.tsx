import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Vehicle, FUEL_TYPES } from "@/types/vehicle";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Info } from 'lucide-react';
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

  return (
    <motion.div 
      variants={itemVariants}
      initial="hidden"
      animate="visible"
    >
      <Card className={cn(
        "border overflow-hidden transform-gpu backface-hidden",
        "bg-white border-gray-200 hover:border-gray-300",
        "dark:bg-slate-900 dark:border-gray-800 dark:hover:border-gray-700"
      )}
      style={{
        boxShadow: isDarkMode
          ? "0 4px 20px -4px rgba(0, 0, 0, 0.2), 0 1px 3px -1px rgba(0, 0, 0, 0.2)"
          : "0 4px 20px -4px rgba(100, 100, 100, 0.15), 0 1px 3px -1px rgba(0, 0, 0, 0.05)"
      }}>
        <CardHeader className={cn(
          "pb-2 border-b",
          "bg-gradient-to-r from-gray-50 to-gray-100/50",
          "dark:bg-gradient-to-r dark:from-slate-900 dark:to-gray-800/40",
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
          "space-y-4 pt-4",
          "bg-gradient-to-b from-white to-gray-50/30",
          "dark:bg-gradient-to-b dark:from-slate-900 dark:to-gray-800/10"
        )}>
          <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
            <div className="space-y-1.5">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Marque</p>
              <p className="font-medium text-gray-800 dark:text-gray-200 capitalize">{getBrandName(vehicle.brand)}</p>
            </div>
            
            <div className="space-y-1.5">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Modèle</p>
              <p className="font-medium text-gray-800 dark:text-gray-200">{vehicle.model || "-"}</p>
            </div>
            
            <div className="space-y-1.5">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Immatriculation</p>
              <p className="font-medium text-gray-800 dark:text-gray-200">{vehicle.registration_number}</p>
            </div>
            
            <div className="space-y-1.5">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Statut</p>
              <p className={getStatusStyles(vehicle.status)}>
                <span className={cn(
                  "w-2 h-2 rounded-full",
                  vehicle.status === 'actif' && "bg-green-500",
                  vehicle.status === 'inactif' && "bg-amber-500",
                  vehicle.status === 'vendu' && "bg-gray-500"
                )} />
                {vehicle.status === 'actif' && "Actif"}
                {vehicle.status === 'inactif' && "Inactif"}
                {vehicle.status === 'vendu' && "Vendu"}
              </p>
            </div>
            
            <div className="space-y-1.5">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Date d'acquisition</p>
              <p className="font-medium text-gray-800 dark:text-gray-200">
                {format(new Date(vehicle.acquisition_date), 'dd MMMM yyyy', { locale: fr })}
              </p>
            </div>
            
            <div className="space-y-1.5">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Type de carburant</p>
              <p className="font-medium text-gray-800 dark:text-gray-200">{getFuelTypeLabel(vehicle.fuel_type)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
