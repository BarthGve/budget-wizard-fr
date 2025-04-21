
// Présentation harmonisée : grille, état vide, responsive
import { Property } from "@/types/property";
import { PropertyCard } from "./PropertyCard";

interface PropertyListProps {
  properties: Property[];
  isLoading: boolean;
}

export const PropertyList = ({ properties, isLoading }: PropertyListProps) => {
  if (isLoading) {
    // Skeletons adaptés à la grille responsive
    return (
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-64 rounded-lg bg-muted animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (properties.length === 0) {
    // État vide mieux intégré visuellement
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 rounded-lg bg-muted border text-center">
        <p className="text-xl font-semibold">Aucune propriété</p>
        <p className="text-muted-foreground">
          Commencez par ajouter votre première propriété en cliquant sur le bouton "Ajouter".
        </p>
      </div>
    );
  }

  // Grille adaptée, responsive sur mobile/tablette/destkop
  return (
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
};
