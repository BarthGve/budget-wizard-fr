
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { VehicleDocument, VehicleDocumentCategory } from '@/types/vehicle-documents';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/components/ui/use-toast';

type DocumentUploadInfo = {
  vehicle_id: string;
  category_id: string;
  name: string;
  description?: string;
};

export default function useVehicleDocuments(vehicleId: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Récupérer les documents
  const {
    data: documents,
    isLoading: isLoadingDocuments,
    error: documentsError,
    refetch: refetchDocuments
  } = useQuery({
    queryKey: ['vehicle-documents', vehicleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vehicle_documents')
        .select('*')
        .eq('vehicle_id', vehicleId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as VehicleDocument[];
    }
  });

  // Récupérer les catégories
  const {
    data: categories,
    isLoading: isLoadingCategories,
    error: categoriesError
  } = useQuery({
    queryKey: ['document-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('document_categories')
        .select('*')
        .order('name');

      if (error) throw error;
      return data as VehicleDocumentCategory[];
    }
  });

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
      setError(null);

      try {
        // 1. Générer un nom de fichier unique
        const fileExt = file.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `${vehicleId}/${fileName}`;

        // 2. Uploader le fichier
        const { error: uploadError } = await supabase.storage
          .from('vehicle-documents')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // 3. Créer l'entrée dans la base de données
        const { error: dbError } = await supabase
          .from('vehicle_documents')
          .insert({
            vehicle_id: documentInfo.vehicle_id,
            category_id: documentInfo.category_id,
            name: documentInfo.name,
            description: documentInfo.description || null,
            file_path: filePath,
          });

        if (dbError) throw dbError;

        // 4. Succès
        toast({
          title: "Document ajouté",
          description: "Le document a été ajouté avec succès",
        });

        return true;
      } catch (error: any) {
        console.error("Erreur lors de l'ajout du document:", error);
        setError(error.message || "Une erreur est survenue");
        toast({
          title: "Erreur",
          description: error.message || "Impossible d'ajouter le document",
          variant: "destructive"
        });
        return false;
      } finally {
        setIsAdding(false);
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
    documents,
    isLoadingDocuments,
    refetchDocuments,
    categories,
    isLoadingCategories,
    isAdding,
    error,
    addDocument
  };
}
