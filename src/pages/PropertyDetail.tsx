
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { PropertiesMap } from "@/components/properties/PropertiesMap";
import { AddExpenseDialog } from "@/components/properties/AddExpenseDialog";
import { ExpensesList } from "@/components/properties/ExpensesList";

const PropertyDetail = () => {
  const { id } = useParams();

  const { data: property, isLoading: isLoadingProperty } = useQuery({
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

  const { data: expenses, isLoading: isLoadingExpenses, refetch: refetchExpenses } = useQuery({
    queryKey: ["property-expenses", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("property_expenses")
        .select("*")
        .eq("property_id", id)
        .order("date", { ascending: false });

      if (error) {
        console.error("Error fetching expenses:", error);
        toast.error("Erreur lors du chargement des dépenses");
        throw error;
      }

      return data;
    },
  });

  if (isLoadingProperty) {
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{property.name}</h1>
            <p className="text-muted-foreground">{property.address}</p>
          </div>
          <AddExpenseDialog propertyId={property.id} onExpenseAdded={() => refetchExpenses()} />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Card className="p-6">
            <div className="h-[200px] mb-4">
              <PropertiesMap properties={[property]} />
            </div>
          </Card>

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

          <Card className="p-6 md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Dépenses</h2>
            {isLoadingExpenses ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : (
              <ExpensesList expenses={expenses || []} />
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PropertyDetail;
