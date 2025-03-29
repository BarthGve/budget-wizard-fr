
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
import { RefreshCw, ArchiveX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVehicles } from "@/hooks/useVehicles";
import { toast } from "sonner";

type VehicleCardProps = { 
  vehicle: Vehicle; 
  onEdit: (vehicle: Vehicle) => void; 
  onDelete: (vehicle: Vehicle) => void;
  onClick: (id: string) => void;
  isDeleting: boolean;
  index?: number;
  isVisible?: boolean;
  isSold?: boolean;
};

export const VehicleCard = ({ 
  vehicle, 
  onEdit, 
  onDelete,
  onClick,
  isDeleting,
  index = 0,
  isVisible = true,
  isSold = false
}: VehicleCardProps) => {
  const { previewLogoUrl, isLogoValid } = useVehicleBrandLogo(vehicle.brand);
  const { theme } = useTheme();
  const { updateVehicle, deleteVehicle } = useVehicles();
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
  
  const handleReactivate = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateVehicle({
      id: vehicle.id,
      status: "actif"
    });
    toast.success("Véhicule remis en statut actif");
  };
  
  const handlePermanentDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Êtes-vous sûr de vouloir supprimer définitivement ce véhicule ?")) {
      deleteVehicle(vehicle.id);
      toast.success("Véhicule supprimé avec succès");
    }
  };
  
  return (
    <VehicleCardAnimation index={index} isVisible={isVisible}>
      <Card 
        className={cn(
          "vehicle-card backface-hidden transform-gpu h-full overflow-hidden relative cursor-pointer",
          "border border-gray-200/70 hover:border-gray-300/80 vehicle-card-hover",
          "dark:border-gray-700/50 dark:hover:border-gray-600/70",
          "bg-white dark:bg-gray-900/95",
          isSold && "border-gray-300/50 dark:border-gray-600/30"
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
        
        {isSold ? (
          <div className="px-4 py-3 mt-auto bg-gray-50/90 dark:bg-gray-800/40 flex justify-between items-center border-t border-gray-200/50 dark:border-gray-700/30">
            <Button
              variant="default"
              size="sm"
              className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white shadow-sm"
              onClick={(e) => {
                e.stopPropagation();
                onClick(vehicle.id);
              }}
            >
              <span className="mr-1">Détails</span>
            </Button>
            
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="text-green-600 dark:text-green-400 border-green-200 dark:border-green-800/40 hover:bg-green-50 dark:hover:bg-green-900/20"
                onClick={handleReactivate}
                aria-label="Remettre en statut actif"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="destructive"
                className="bg-red-500/10 text-red-600 hover:bg-red-500/20 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
                onClick={handlePermanentDelete}
                aria-label="Supprimer définitivement"
              >
                <ArchiveX className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <VehicleCardFooter
            vehicle={vehicle}
            onEdit={onEdit}
            onDelete={onDelete}
            onClick={onClick}
            isDeleting={isDeleting}
          />
        )}
      </Card>
    </VehicleCardAnimation>
  );
};
