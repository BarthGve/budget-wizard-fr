
interface VehiclePhotoDisplayProps {
  photoUrl: string;
  brand: string;
  model?: string;
}

export const VehiclePhotoDisplay = ({ photoUrl, brand, model }: VehiclePhotoDisplayProps) => {
  return (
    <div className="relative aspect-video overflow-hidden rounded-md">
      <img
        src={photoUrl}
        alt={`${brand} ${model || ""}`}
        className="object-cover w-full h-full"
      />
    </div>
  );
};
