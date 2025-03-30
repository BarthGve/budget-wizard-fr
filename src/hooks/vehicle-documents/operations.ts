
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
      const { error: storageError } = await supabase
        .storage
        .from("vehicle_documents")
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
      const { data, error } = await supabase
        .storage
        .from("vehicle_documents")
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

// Hook pour la mise à jour des documents
export const useDocumentUpdate = (vehicleId: string) => {
  const queryClient = useQueryClient();

  // Mettre à jour un document
  const { mutate: updateDocument, isPending: isUpdating } = useMutation({
    mutationFn: async ({ 
      documentId, 
      name, 
      description, 
      categoryId 
    }: { 
      documentId: string; 
      name?: string;
      description?: string;
      categoryId?: string;
    }) => {
      console.log("Mise à jour du document:", documentId, "avec la catégorie:", categoryId);
      
      // Préparer les données à mettre à jour
      const updateData: Partial<VehicleDocument> = {};
      if (name) updateData.name = name;
      if (description !== undefined) updateData.description = description;
      if (categoryId) updateData.category_id = categoryId;

      // Aucune donnée à mettre à jour
      if (Object.keys(updateData).length === 0) {
        return null;
      }

      // Mettre à jour les informations du document dans la base de données
      const { data, error } = await supabase
        .from("vehicle_documents")
        .update(updateData)
        .eq("id", documentId)
        .select("*")
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicle-documents", vehicleId] });
      showSuccess("Document mis à jour avec succès");
    },
    onError: (error: any) => {
      console.error("Erreur lors de la mise à jour du document:", error);
      handleError(error, "Erreur lors de la mise à jour du document");
    },
  });

  return { updateDocument, isUpdating };
};
