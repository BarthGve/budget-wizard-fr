
// Visuel harmonisé : fond blanc/vitreux, shadow doux, border-radius homogène, hover léger et responsive adapté
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
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface PropertyCardProps {
  property: Property;
}

export const PropertyCard = ({ property }: PropertyCardProps) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

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
    <Card
      className={cn(
        "group cursor-pointer border-none shadow-xl",
        "rounded-2xl overflow-hidden bg-white/90 dark:bg-quaternary-900/40 backdrop-blur-md hover:shadow-2xl",
        "transition-all duration-200 flex flex-col min-h-[320px]",
        isMobile ? "hover:scale-[1.01] active:scale-95" : "hover:scale-[1.02]"
      )}
      onClick={handleCardClick}
      style={{
        boxShadow:
          "0 4px 36px -6px rgba(55, 195, 173,0.10), 0 2px 8px -2px rgba(0,0,0,0.04)",
      }}
    >
      <CardHeader className={cn("relative h-44 p-0 overflow-hidden", isMobile ? "h-40" : "h-44")}>
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
      <CardContent className="grid gap-1.5 p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <h3 className={cn("font-semibold text-lg", isMobile && "text-base")}>{property.name}</h3>
            {property.investment_type && (
              <Badge variant="secondary" className="text-xs bg-quaternary/10 text-quaternary mx-2">
                {property.investment_type}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Home className="w-4 h-4 text-quaternary-500 dark:text-quaternary-300" />
          </div>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-1 mb-2">{property.address}</p>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div className="flex items-center gap-2">
            <Ruler className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Superficie</p>
              <p className="font-medium">{property.area} m²</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Valeur d&apos;achat</p>
              <p className="font-medium">{formatCurrency(property.purchase_value)}</p>
            </div>
          </div>
          {property.loan_payment && property.loan_payment > 0 && (
            <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
              <CreditCard className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Mensualité du prêt</p>
                <p className="font-medium">{formatCurrency(property.loan_payment)}</p>
              </div>
            </div>
          )}
          {property.monthly_rent && property.monthly_rent > 0 && (
            <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
              <Coins className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Loyer mensuel</p>
                <p className="font-medium">{formatCurrency(property.monthly_rent)}</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
