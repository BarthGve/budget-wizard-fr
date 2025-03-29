
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { VehicleDocument } from "@/types/vehicle-documents";
import { sanitizeFileName, handleError, showSuccess } from "./utils";

export const useDocumentUpload = (vehicleId: string, userId?: string) => {
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);

  // Télécharger un document
  const uploadDocument = async (
    file: File,
    document: Omit<VehicleDocument, "id" | "file_path" | "file_size" | "content_type" | "created_at" | "updated_at">
  ) => {
    if (!userId || !file) {
      handleError(new Error("Informations manquantes"), "Informations manquantes pour l'upload");
      return null;
    }

    try {
      console.log("Démarrage de l'upload du document:", file.name);
      setIsUploading(true);

      // Nettoyer le nom du fichier pour éviter les problèmes avec Supabase Storage
      const cleanFileName = sanitizeFileName(file.name);
      console.log("Nom du fichier nettoyé:", cleanFileName);

      // 1. Upload du fichier dans le stockage Supabase
      const filePath = `${userId}/${vehicleId}/${Date.now()}_${cleanFileName}`;
      console.log("Chemin du fichier:", filePath);
      
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from("vehicle_documents")
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error("Erreur d'upload:", uploadError);
        throw new Error(`Erreur lors de l'upload: ${uploadError.message}`);
      }

      console.log("Fichier uploadé avec succès:", uploadData);

      // 2. Enregistrer les informations du document dans la base de données
      const { data, error } = await supabase
        .from("vehicle_documents")
        .insert({
          ...document,
          file_path: filePath,
          file_size: file.size,
          content_type: file.type,
        })
        .select()
        .single();

      if (error) {
        // En cas d'erreur, essayer de supprimer le fichier uploadé
        await supabase.storage
          .from("vehicle_documents")
          .remove([filePath]);
          
        console.error("Erreur lors de l'insertion en base de données:", error);
        throw new Error(`Erreur lors de l'enregistrement: ${error.message}`);
      }

      console.log("Document ajouté avec succès en base de données:", data);
      showSuccess("Document ajouté avec succès");
      return data as VehicleDocument;

    } catch (err: any) {
      console.error("Erreur lors de l'upload du document:", err);
      handleError(err, err.message || "Erreur lors de l'ajout du document");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  // Mutation pour ajouter un document
  const { mutateAsync: addDocument, isPending: isAdding } = useMutation({
    mutationFn: async ({ file, document }: { 
      file: File, 
      document: Omit<VehicleDocument, "id" | "file_path" | "file_size" | "content_type" | "created_at" | "updated_at"> 
    }) => {
      console.log("Ajout d'un document", { file, document });
      return uploadDocument(file, document);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicle-documents", vehicleId] });
    },
  });

  return { addDocument, isAdding, isUploading };
};
