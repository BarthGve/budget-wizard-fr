
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { sanitizeFileName } from './utils';

type DocumentUploadInfo = {
  vehicle_id: string;
  category_id: string;
  name: string;
  description?: string;
};

export const useDocumentUpload = (vehicleId: string, userId?: string) => {
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Mutation pour ajouter un document
  const addDocumentMutation = useMutation({
    mutationFn: async ({
      file,
      document: documentInfo
    }: {
      file: File;
      document: DocumentUploadInfo;
    }) => {
      setIsAdding(true);
      setIsUploading(true);

      try {
        // 1. Générer un nom de fichier unique
        const fileExt = file.name.split('.').pop();
        const timestamp = Date.now();
        const sanitizedName = sanitizeFileName(file.name.split('.')[0]);
        const fileName = `${timestamp}_${sanitizedName}.${fileExt}`;
        
        // Construire le chemin avec l'ID utilisateur et l'ID véhicule
        const userPath = userId || 'anonymous';
        const filePath = `${userPath}/${documentInfo.vehicle_id}/${fileName}`;

        console.log("Début de l'upload du fichier:", filePath);
        console.log("Stockage utilisé:", "vehicle-documents"); // Log pour vérification
        
        // 2. Upload le fichier
        const { error: uploadError } = await supabase.storage
          .from('vehicle-documents')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error("Erreur d'upload:", uploadError);
          throw uploadError;
        }

        setIsUploading(false);
        console.log("Fichier uploadé avec succès");

        // 3. Créer l'entrée dans la base de données
        const { error: dbError } = await supabase
          .from('vehicle_documents')
          .insert({
            vehicle_id: documentInfo.vehicle_id,
            category_id: documentInfo.category_id,
            name: documentInfo.name,
            description: documentInfo.description || null,
            file_path: filePath,
            file_size: file.size,
            content_type: file.type
          });

        if (dbError) {
          console.error("Erreur d'insertion dans la base de données:", dbError);
          throw dbError;
        }

        // 4. Succès
        toast.success("Document ajouté", {
          description: "Le document a été ajouté avec succès"
        });

        return true;
      } catch (error: any) {
        console.error("Erreur lors de l'ajout du document:", error);
        toast.error("Erreur", {
          description: error.message || "Impossible d'ajouter le document"
        });
        return false;
      } finally {
        setIsAdding(false);
        setIsUploading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicle-documents', vehicleId] });
    }
  });

  // Fonction pour ajouter un document
  const addDocument = async (params: { file: File; document: DocumentUploadInfo }) => {
    return addDocumentMutation.mutateAsync(params);
  };

  return {
    addDocument,
    isAdding,
    isUploading
  };
};
