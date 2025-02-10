
import { Property } from "@/types/property";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, MapPin, Ruler } from "lucide-react";
import { formatCurrency } from "@/utils/format";
import { EditPropertyDialog } from "./EditPropertyDialog";

interface PropertyCardProps {
  property: Property;
}

export const PropertyCard = ({ property }: PropertyCardProps) => {
  return (
    <Card>
      <CardHeader className="relative h-48 p-0 overflow-hidden">
        <img
          src={property.photo_url || "/placeholder.svg"}
          alt={property.name}
          className="object-cover w-full h-full"
        />
        <div className="absolute top-2 right-2">
          <EditPropertyDialog property={property} />
        </div>
      </CardHeader>
      <CardContent className="grid gap-2 p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold">{property.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-1">
              {property.address}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 py-2">
          <div className="flex items-center gap-2">
            <Ruler className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">{property.area} m²</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">Carte</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="grid gap-2 p-4 pt-0">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Valeur</p>
            <p className="font-medium">{formatCurrency(property.purchase_value)}</p>
          </div>
          {property.monthly_rent && (
            <div>
              <p className="text-sm text-muted-foreground">Loyer mensuel</p>
              <p className="font-medium">{formatCurrency(property.monthly_rent)}</p>
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};
