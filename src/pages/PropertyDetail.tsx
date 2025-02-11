
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const PropertyDetail = () => {
  const { id } = useParams();

  const { data: property, isLoading } = useQuery({
    queryKey: ["property", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching property:", error);
        toast.error("Erreur lors du chargement de la propriété");
        throw error;
      }

      return data;
    },
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="grid gap-6">
          <Skeleton className="h-[200px] w-full" />
          <div className="grid gap-4">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!property) {
    return (
      <DashboardLayout>
        <div className="text-center">
          <h1 className="text-2xl font-bold">Propriété non trouvée</h1>
          <p className="text-muted-foreground">
            La propriété que vous recherchez n'existe pas.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{property.name}</h1>
          <p className="text-muted-foreground">{property.address}</p>
        </div>

        <div className="grid gap-4">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Détails</h2>
            <div className="grid gap-2">
              <div>
                <span className="font-medium">Prix d'achat:</span>{" "}
                {property.purchase_value.toLocaleString()} €
              </div>
              <div>
                <span className="font-medium">Surface:</span> {property.area} m²
              </div>
              <div>
                <span className="font-medium">Type d'investissement:</span>{" "}
                {property.investment_type || "Non spécifié"}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PropertyDetail;
