
import { Property } from "@/types/property";
import { PropertyCard } from "./PropertyCard";

interface PropertyListProps {
  properties: Property[];
  isLoading: boolean;
}

export const PropertyList = ({ properties, isLoading }: PropertyListProps) => {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
        <p className="text-lg font-medium">Aucune propriété</p>
        <p className="text-muted-foreground">
          Commencez par ajouter votre première propriété
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
};
