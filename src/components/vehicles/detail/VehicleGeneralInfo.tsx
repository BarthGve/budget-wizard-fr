
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Vehicle, FUEL_TYPES } from "@/types/vehicle";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {Info} from 'lucide-react';

interface VehicleGeneralInfoProps {
  vehicle: Vehicle;
}

export const VehicleGeneralInfo = ({ vehicle }: VehicleGeneralInfoProps) => {
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

  return (
    <motion.div variants={itemVariants}>
      <Card className={cn(
        "border shadow-sm overflow-hidden",
        "bg-white border-gray-100 dark:bg-gray-800 dark:border-gray-700"
      )}>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center gap-2">
            <div className="p-1.5 rounded bg-gray-100 dark:bg-gray-800/70">
              <Info className="text-gray-600 dark:text-gray-400" />
            </div>
            Informations générales
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Marque</p>
              <p className="font-medium capitalize">{getBrandName(vehicle.brand)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Modèle</p>
              <p className="font-medium">{vehicle.model || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Immatriculation</p>
              <p className="font-medium">{vehicle.registration_number}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Statut</p>
              <p className="font-medium">
                {vehicle.status === 'actif' && <span className="text-green-500">Actif</span>}
                {vehicle.status === 'inactif' && <span className="text-yellow-500">Inactif</span>}
                {vehicle.status === 'vendu' && <span className="text-gray-500">Vendu</span>}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Date d'acquisition</p>
              <p className="font-medium">
                {format(new Date(vehicle.acquisition_date), 'dd MMMM yyyy', { locale: fr })}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Type de carburant</p>
              <p className="font-medium">{getFuelTypeLabel(vehicle.fuel_type)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
