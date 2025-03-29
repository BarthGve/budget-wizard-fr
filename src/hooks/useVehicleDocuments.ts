
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { VehicleDocument, VehicleDocumentCategory } from "@/types/vehicle-documents";
import { toast } from "sonner";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export const useVehicleDocuments = (vehicleId: string) => {
  const queryClient = useQueryClient();
  const { currentUser } = useCurrentUser();
  const [isUploading, setIsUploading] = useState(false);
  const userId = currentUser?.id;

  // Récupérer tous les documents d'un véhicule
  const {
    data: documents,
    isLoading: isLoadingDocuments,
    error: documentsError,
  } = useQuery({
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
        toast.error("Impossible de charger les documents du véhicule");
        throw error;
      }

      console.log("Documents chargés:", data);
      return data as (VehicleDocument & { vehicle_document_categories: VehicleDocumentCategory })[];
    },
    enabled: !!vehicleId && !!userId,
  });

  // Récupérer toutes les catégories de documents
  const {
    data: categories,
    isLoading: isLoadingCategories,
  } = useQuery({
    queryKey: ["vehicle-document-categories"],
    queryFn: async () => {
      console.log("Chargement des catégories de documents");
      const { data, error } = await supabase
        .from("vehicle_document_categories")
        .select("*")
        .order("name", { ascending: true });

      if (error) {
        console.error("Erreur lors du chargement des catégories:", error);
        toast.error("Impossible de charger les catégories de documents");
        throw error;
      }

      console.log("Catégories chargées:", data);
      return data as VehicleDocumentCategory[];
    },
  });

  // Fonction pour nettoyer les noms de fichiers
  const sanitizeFileName = (fileName: string): string => {
    // Remplacer les caractères accentués et spéciaux
    return fileName
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
      .replace(/[^\w.-]/g, '_'); // Remplacer les autres caractères spéciaux par des underscores
  };

  // Télécharger un document
  const uploadDocument = async (
    file: File,
    document: Omit<VehicleDocument, "id" | "file_path" | "file_size" | "content_type" | "created_at" | "updated_at">
  ) => {
    if (!userId || !file) {
      toast.error("Informations manquantes pour l'upload");
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
      toast.success("Document ajouté avec succès");
      return data as VehicleDocument;

    } catch (err: any) {
      console.error("Erreur lors de l'upload du document:", err);
      toast.error(err.message || "Erreur lors de l'ajout du document");
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
      toast.success("Document supprimé avec succès");
    },
    onError: (error: any) => {
      console.error("Erreur lors de la suppression du document:", error);
      toast.error("Erreur lors de la suppression du document");
    },
  });

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
        toast.error("Impossible d'accéder au document");
        return null;
      }

      console.log("URL signée créée:", data.signedUrl);
      return data.signedUrl;
    } catch (err) {
      console.error("Erreur lors de la récupération de l'URL du document:", err);
      return null;
    }
  };

  return {
    documents,
    isLoadingDocuments,
    documentsError,
    categories,
    isLoadingCategories,
    addDocument,
    isAdding,
    deleteDocument,
    isDeleting,
    getDocumentUrl,
    isUploading
  };
};
