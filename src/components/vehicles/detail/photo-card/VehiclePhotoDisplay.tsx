
interface VehiclePhotoDisplayProps {
  photoUrl: string;
  brand: string;
  model?: string;
}

export const VehiclePhotoDisplay = ({ photoUrl, brand, model }: VehiclePhotoDisplayProps) => {
  return (
    <div className="relative aspect-video overflow-hidden rounded-md bg-gray-100">
      <img
        src={photoUrl}
        alt={`${brand} ${model || ""}`}
        className="object-cover w-full h-full"
        loading="lazy"
        onError={(e) => {
          // En cas d'erreur de chargement de l'image, afficher un message
          const target = e.target as HTMLImageElement;
          target.onerror = null; // Éviter les boucles d'erreur
          target.src = '/placeholder.svg'; // Image par défaut
        }}
      />
    </div>
  );
};
