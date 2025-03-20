
import { Vehicle } from "@/types/vehicle";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tag, MoreVertical, Car, Trash, ArrowRight } from "lucide-react";
import { useVehicleBrandLogo } from "@/hooks/useVehicleBrandLogo";
import { BrandLogoPreview } from "./BrandLogoPreview";
import { useNavigate } from "react-router-dom";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useVehicles } from "@/hooks/useVehicles";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type SoldVehiclesListProps = {
  vehicles: Vehicle[];
};

// Composant pour afficher une ligne de véhicule vendu
const SoldVehicleRow = ({ vehicle }: { vehicle: Vehicle }) => {
  const { previewLogoUrl, isLogoValid } = useVehicleBrandLogo(vehicle.brand || "");
  const navigate = useNavigate();
  const { updateVehicle, deleteVehicle } = useVehicles();
  
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
  
  const handleNavigateToDetail = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/vehicles/${vehicle.id}`);
  };
  
  return (
    <div className="flex items-center justify-between py-2 px-4 border-b last:border-0 hover:bg-gray-50">
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
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">Actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleNavigateToDetail}>
            <Car className="mr-2 h-4 w-4" />
            Voir le véhicule
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleReactivate}>
            <ArrowRight className="mr-2 h-4 w-4" />
            Remettre actif
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDelete} className="text-destructive">
            <Trash className="mr-2 h-4 w-4" />
            Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export const SoldVehiclesList = ({ vehicles }: SoldVehiclesListProps) => {
  // Filtrer pour n'afficher que les véhicules vendus
  const soldVehicles = vehicles.filter(v => v.status === "vendu");
  
  if (soldVehicles.length === 0) {
    return null;
  }
  
  return (
    <Card className="mt-8">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Véhicules vendus</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="divide-y">
          {soldVehicles.map(vehicle => (
            <SoldVehicleRow key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
