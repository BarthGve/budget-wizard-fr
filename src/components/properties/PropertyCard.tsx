
import { Property } from "@/types/property";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Ruler, DollarSign, CreditCard, Cash, Layers } from "lucide-react";
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
          <div className="flex items-center gap-2">
            <Home className="w-4 h-4 text-primary" />
          </div>
        </div>
        <div className="flex items-center gap-2 py-2">
          <Ruler className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm">{property.area} m²</span>
        </div>
        {property.investment_type && (
          <div className="flex items-center gap-2 py-1">
            <Layers className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Type d'investissement</p>
              <p className="font-medium">{property.investment_type}</p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="grid gap-2 p-4 pt-0">
        <div className="grid gap-4">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Valeur d'achat</p>
              <p className="font-medium">{formatCurrency(property.purchase_value)}</p>
            </div>
          </div>
          {property.loan_payment && property.loan_payment > 0 && (
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Mensualité du prêt</p>
                <p className="font-medium">{formatCurrency(property.loan_payment)}</p>
              </div>
            </div>
          )}
          {property.monthly_rent && property.monthly_rent > 0 && (
            <div className="flex items-center gap-2">
              <Cash className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Loyer mensuel</p>
                <p className="font-medium">{formatCurrency(property.monthly_rent)}</p>
              </div>
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

