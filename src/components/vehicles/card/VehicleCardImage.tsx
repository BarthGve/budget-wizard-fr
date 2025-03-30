
import { StatusBadge } from "./StatusBadge";

type VehicleCardImageProps = {
  photoUrl?: string;
  brand: string;
  model?: string;
  status: string;
};

export const VehicleCardImage = ({ photoUrl, brand, model, status }: VehicleCardImageProps) => {
  if (!photoUrl) {
    return null;
  }

  return (
    <div className="vehicle-card-image-container">
      <img
        src={photoUrl}
        alt={`${brand} ${model || ""}`}
        className="vehicle-card-image"
      />
      <div className="absolute top-3 right-3 z-10">
        <StatusBadge status={status} />
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/40 to-transparent"></div>
    </div>
  );
};
