
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { VehicleDocument, VehicleDocumentCategory } from "@/types/vehicle-documents";
import { handleError } from "./utils";

// Récupérer tous les documents d'un véhicule
export const useVehicleDocumentsQuery = (vehicleId: string) => {
  return useQuery({
    queryKey: ["vehicle-documents", vehicleId],
    queryFn: async () => {
      console.log("Chargement des documents pour le véhicule:", vehicleId);
      const { data, error } = await supabase
        .from("vehicle_documents")
        .select("*, vehicle_document_categories(*)")
        .eq("vehicle_id", vehicleId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erreur lors du chargement des documents:", error);
        handleError(error, "Impossible de charger les documents du véhicule");
        throw error;
      }

      console.log("Documents chargés:", data);
      return data as (VehicleDocument & { vehicle_document_categories: VehicleDocumentCategory })[];
    },
    enabled: !!vehicleId, // Activer la requête uniquement si l'ID du véhicule est défini
  });
};

// Récupérer toutes les catégories de documents
export const useDocumentCategoriesQuery = () => {
  return useQuery({
    queryKey: ["vehicle-document-categories"],
    queryFn: async () => {
      console.log("Chargement des catégories de documents");
      const { data, error } = await supabase
        .from("vehicle_document_categories")
        .select("*")
        .order("name", { ascending: true });

      if (error) {
        console.error("Erreur lors du chargement des catégories:", error);
        handleError(error, "Impossible de charger les catégories de documents");
        throw error;
      }

      console.log("Catégories chargées:", data);
      return data as VehicleDocumentCategory[];
    },
  });
};
