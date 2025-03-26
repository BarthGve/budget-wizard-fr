
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Property } from "@/types/property";
import { Home } from "lucide-react";

interface HousingCardProps {
  property: Property;
}

export const HousingCard = ({ property }: HousingCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-xl font-medium">
          <Home className="h-5 w-5 mr-2 text-blue-500" /> 
          Informations du logement
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Adresse</h3>
            <p className="mt-1">{property.address}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Superficie</h3>
              <p className="mt-1">{property.area} m²</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Type de chauffage</h3>
              <p className="mt-1">{property.heating_type || "Non spécifié"}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
