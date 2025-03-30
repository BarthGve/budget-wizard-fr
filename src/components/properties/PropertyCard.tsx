
import { Property } from "@/types/property";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Ruler, DollarSign, CreditCard, Coins, Trash2 } from "lucide-react";
import { formatCurrency } from "@/utils/format";
import { EditPropertyDialog } from "./EditPropertyDialog";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface PropertyCardProps {
  property: Property;
}

export const PropertyCard = ({ property }: PropertyCardProps) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from("properties")
        .delete()
        .eq("id", property.id);

      if (error) throw error;

      toast.success("Bien supprimé avec succès");
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    } catch (error) {
      console.error("Error deleting property:", error);
      toast.error("Erreur lors de la suppression du bien");
    }
  };

  const handleCardClick = () => {
    navigate(`/properties/${property.id}`);
  };

  return (
    <Card className="cursor-pointer transition-transform hover:scale-[1.02]" onClick={handleCardClick}>
      <CardHeader className="relative h-48 p-0 overflow-hidden">
        <img
          src={property.photo_url || "/placeholder.svg"}
          alt={property.name}
          className="object-cover w-full h-full"
        />
        <div className="absolute top-2 right-2 flex gap-2" onClick={(e) => e.stopPropagation()}>
          <EditPropertyDialog property={property} />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={(e) => e.stopPropagation()}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Supprimer le bien</AlertDialogTitle>
                <AlertDialogDescription>
                  Êtes-vous sûr de vouloir supprimer ce bien ? Cette action ne peut pas être annulée.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Annuler</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete();
                  }}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>
      <CardContent className="grid gap-2 p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">{property.name}</h3>
            {property.investment_type && (
              <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
                {property.investment_type}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Home className="w-4 h-4 text-primary" />
          </div>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-1">
          {property.address}
        </p>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="flex items-center gap-2">
            <Ruler className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Superficie</p>
              <p className="font-medium">{property.area} m²</p>
            </div>
          </div>

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
              <Coins className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Loyer mensuel</p>
                <p className="font-medium">{formatCurrency(property.monthly_rent)}</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
