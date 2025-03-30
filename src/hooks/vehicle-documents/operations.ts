
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { VehicleDocument } from "@/types/vehicle-documents";
import { handleError, showSuccess } from "./utils";

// Hook pour la suppression de documents
export const useDocumentDelete = (vehicleId: string) => {
  const queryClient = useQueryClient();

  // Supprimer un document
  const { mutate: deleteDocument, isPending: isDeleting } = useMutation({
    mutationFn: async (document: VehicleDocument) => {
      console.log("Suppression du document:", document);
      
      // 1. Supprimer le fichier du stockage
      // Correction du bucket: "vehicle-documents" au lieu de "vehicle_documents"
      const { error: storageError } = await supabase
        .storage
        .from("vehicle-documents")
        .remove([document.file_path]);

      if (storageError) {
        console.error("Erreur lors de la suppression du fichier:", storageError);
      }

      // 2. Supprimer les informations du document de la base de données
      const { error } = await supabase
        .from("vehicle_documents")
        .delete()
        .eq("id", document.id);

      if (error) {
        throw error;
      }

      return document;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicle-documents", vehicleId] });
      showSuccess("Document supprimé avec succès");
    },
    onError: (error: any) => {
      console.error("Erreur lors de la suppression du document:", error);
      handleError(error, "Erreur lors de la suppression du document");
    },
  });

  return { deleteDocument, isDeleting };
};

// Hook pour obtenir l'URL d'un document
export const useDocumentUrl = () => {
  // Obtenir l'URL publique (signée) d'un document
  const getDocumentUrl = async (filePath: string) => {
    try {
      console.log("Création d'une URL signée pour:", filePath);
      // Correction du bucket: "vehicle-documents" au lieu de "vehicle_documents"
      const { data, error } = await supabase
        .storage
        .from("vehicle-documents")
        .createSignedUrl(filePath, 60 * 60); // URL valide pendant 1 heure

      if (error) {
        console.error("Erreur lors de la création de l'URL signée:", error);
        handleError(error, "Impossible d'accéder au document");
        return null;
      }

      console.log("URL signée créée:", data.signedUrl);
      return data.signedUrl;
    } catch (err) {
      console.error("Erreur lors de la récupération de l'URL du document:", err);
      return null;
    }
  };

  return { getDocumentUrl };
};
