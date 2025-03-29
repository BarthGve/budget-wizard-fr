
import { Vehicle } from "@/types/vehicle";
import { Card } from "@/components/ui/card";
import { useVehicleBrandLogo } from "@/hooks/useVehicleBrandLogo";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { VehicleCardAnimation } from "./VehicleCardAnimation";
import { VehicleCardHeader } from "./VehicleCardHeader";
import { VehicleCardImage } from "./VehicleCardImage";
import { VehicleCardInfo } from "./VehicleCardInfo";
import { VehicleCardFooter } from "./VehicleCardFooter";

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
  
  const handleCardClick = (e: React.MouseEvent) => {
    // Vérifier si le clic provient d'un bouton ou d'un autre élément interactif
    const target = e.target as HTMLElement;
    if (target.closest('button') !== null) {
      // Si c'est un clic sur un bouton, ne pas naviguer vers la page de détail
      return;
    }
    
    // Sinon, naviguer vers la page de détail du véhicule
    onClick(vehicle.id);
  };
  
  return (
    <VehicleCardAnimation index={index} isVisible={isVisible}>
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
        onClick={handleCardClick}
      >
        <VehicleCardImage 
          photoUrl={vehicle.photo_url} 
          brand={vehicle.brand}
          model={vehicle.model}
          status={vehicle.status}
        />
        
        <VehicleCardHeader 
          brand={vehicle.brand}
          model={vehicle.model}
          status={vehicle.status}
          previewLogoUrl={previewLogoUrl}
          isLogoValid={isLogoValid}
          hasPhoto={!!vehicle.photo_url}
        />
        
        <VehicleCardInfo 
          vehicle={vehicle} 
          hasPhoto={!!vehicle.photo_url}
        />
        
        <VehicleCardFooter
          vehicle={vehicle}
          onEdit={onEdit}
          onDelete={onDelete}
          onClick={onClick}
          isDeleting={isDeleting}
        />
      </Card>
    </VehicleCardAnimation>
  );
};
