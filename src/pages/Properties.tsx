
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PropertyList } from "@/components/properties/PropertyList";
import { AddPropertyDialog } from "@/components/properties/AddPropertyDialog";
import { PropertiesMap } from "@/components/properties/PropertiesMap";
import { toast } from "sonner";

const Properties = () => {
  const { data: properties, isLoading } = useQuery({
    queryKey: ["properties"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching properties:", error);
        toast.error("Erreur lors du chargement des propriétés");
        throw error;
      }

      return data;
    },
  });

  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Propriétés</h1>
            <p className="text-muted-foreground">
              Gérez vos biens immobiliers et suivez leurs performances
            </p>
          </div>
          <AddPropertyDialog />
        </div>

        <PropertiesMap properties={properties || []} />
        <PropertyList properties={properties || []} isLoading={isLoading} />
      </div>
    </DashboardLayout>
  );
};

export default Properties;
