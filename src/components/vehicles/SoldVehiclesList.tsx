
import { Vehicle } from "@/types/vehicle";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tag, MoreVertical, Car, Trash, ArrowRight } from "lucide-react";
import { useVehicleBrandLogo } from "@/hooks/useVehicleBrandLogo";
import { BrandLogoPreview } from "./BrandLogoPreview";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useVehicles } from "@/hooks/useVehicles";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

type SoldVehiclesListProps = {
  vehicles: Vehicle[];
  onVehicleClick?: (id: string) => void;
};

// Composant pour afficher une ligne de véhicule vendu
const SoldVehicleRow = ({ vehicle, onVehicleClick }: { vehicle: Vehicle; onVehicleClick?: (id: string) => void }) => {
  const { previewLogoUrl, isLogoValid } = useVehicleBrandLogo(vehicle.brand || "");
  const { updateVehicle, deleteVehicle } = useVehicles();
  const navigate = useNavigate();
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Êtes-vous sûr de vouloir supprimer définitivement ce véhicule ?")) {
      deleteVehicle(vehicle.id);
      toast.success("Véhicule supprimé avec succès");
    }
  };
  
  const handleReactivate = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateVehicle({
      id: vehicle.id,
      status: "actif"
    });
    toast.success("Véhicule remis en statut actif");
  };
  
  const handleCardClick = () => {
    if (onVehicleClick) {
      onVehicleClick(vehicle.id);
    }
  };
  
  // Si onVehicleClick n'est pas fourni, naviguer directement
  const handleViewVehicle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onVehicleClick) {
      onVehicleClick(vehicle.id);
    } else {
      navigate(`/vehicles/${vehicle.id}`);
    }
  };
  
  return (
    <motion.div 
      className="border-b last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer"
      whileHover={{ scale: 1.01, backgroundColor: "rgba(0,0,0,0.02)" }}
      whileTap={{ scale: 0.99 }}
      onClick={handleCardClick}
    >
      <div className="flex items-center justify-between py-3 px-4">
        <div className="flex items-center gap-3">
          <BrandLogoPreview 
            url={previewLogoUrl}
            isValid={isLogoValid}
            isChecking={false}
            brand={vehicle.brand}
            size="sm"
          />
          <div>
            <div className="font-medium">{vehicle.model || vehicle.brand}</div>
            <div className="flex items-center text-sm text-gray-500">
              <Tag className="mr-1 h-3 w-3" />
              {vehicle.registration_number}
            </div>
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleViewVehicle}>
              <Car className="mr-2 h-4 w-4" />
              Voir le véhicule
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation();
              handleReactivate(e);
            }}>
              <ArrowRight className="mr-2 h-4 w-4" />
              Remettre actif
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation();
              handleDelete(e);
            }} className="text-destructive">
              <Trash className="mr-2 h-4 w-4" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.div>
  );
};

export const SoldVehiclesList = ({ vehicles, onVehicleClick }: SoldVehiclesListProps) => {
  // Filtrer pour n'afficher que les véhicules vendus
  const soldVehicles = vehicles.filter(v => v.status === "vendu");
  
  if (soldVehicles.length === 0) {
    return (
      <Card className="overflow-hidden border-dashed border-2 border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/30">
        <CardContent className="p-6 flex flex-col items-center justify-center text-center h-[200px]">
          <Car className="h-12 w-12 text-gray-400 mb-3" />
          <CardTitle className="text-base font-medium text-gray-600 dark:text-gray-400 mb-1">
            Aucun véhicule vendu
          </CardTitle>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Les véhicules marqués comme vendus apparaîtront ici
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Liste des véhicules vendus</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 px-0">
        <div>
          {soldVehicles.map((vehicle) => (
            <SoldVehicleRow 
              key={vehicle.id} 
              vehicle={vehicle} 
              onVehicleClick={onVehicleClick} 
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
