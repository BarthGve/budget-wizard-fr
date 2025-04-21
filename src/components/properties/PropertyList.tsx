
// Composant list aligné visuel (cards détachées, grille adaptée)
import { Property } from "@/types/property";
import { PropertyCard } from "./PropertyCard";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface PropertyListProps {
  properties: Property[];
  isLoading: boolean;
}

export const PropertyList = ({ properties, isLoading }: PropertyListProps) => {
  const isMobile = useIsMobile();
  if (isLoading) {
    return (
      <div className={cn(
        "grid gap-4",
        isMobile ? "grid-cols-1" : "md:grid-cols-2 lg:grid-cols-3"
      )}>
        {[...Array(isMobile ? 1 : 3)].map((_, i) => (
          <div
            key={i}
            className="h-64 rounded-xl bg-muted animate-pulse shadow-md"
          />
        ))}
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-12 text-center bg-white/70 dark:bg-quaternary-900/30 rounded-xl shadow">
        <p className="text-lg font-medium">Aucune propriété</p>
        <p className="text-muted-foreground">
          Commencez par ajouter votre première propriété
        </p>
      </div>
    );
  }

  return (
    <div className={cn(
      "grid gap-6",
      isMobile ? "grid-cols-1" : "md:grid-cols-2 lg:grid-cols-3"
    )}>
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
};
