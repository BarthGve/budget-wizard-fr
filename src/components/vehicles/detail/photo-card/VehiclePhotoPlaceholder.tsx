
import { Car } from "lucide-react";

export const VehiclePhotoPlaceholder = () => {
  return (
    <div className="flex flex-col items-center justify-center h-48">
      <Car className="h-12 w-12 text-muted-foreground" />
      <p className="mt-2 text-muted-foreground">Aucune photo disponible</p>
    </div>
  );
};
