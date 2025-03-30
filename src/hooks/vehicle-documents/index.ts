
import { useMemo } from 'react';
import {
  useAddDocument,
  useDeleteDocument,
  useUpdateDocument,
  useViewDocument
} from './operations';
import {
  useDocumentCategories,
  useDocuments,
} from './queries';
import { useStorage } from './upload';

// Hook principal pour gérer les documents des véhicules
export const useVehicleDocuments = (vehicleId: string) => {
  // Récupérer les documents du véhicule
  const { 
    data: documents, 
    isLoading: isLoadingDocuments, 
    error: documentsError,
    refetch: refetchDocuments 
  } = useDocuments(vehicleId);
  
  // Récupérer les catégories de documents
  const { 
    data: categories, 
    isLoading: isLoadingCategories, 
    error: categoriesError 
  } = useDocumentCategories();
  
  // Opérations de base de données
  const { addDocument, isAdding } = useAddDocument(vehicleId);
  const { deleteDocument, isDeleting } = useDeleteDocument(vehicleId);
  const { updateDocument, isUpdating } = useUpdateDocument(vehicleId);
  
  // Opération de visualisation
  const { viewDocument, isViewing } = useViewDocument();
  
  // Hooks de stockage pour les opérations sur les fichiers
  const { uploadFile, downloadFile, isUploading, isDownloading } = useStorage();
  
  // Mémoisation des catégories avec la nouvelle catégorie "Financement"
  const enhancedCategories = useMemo(() => {
    // Vérifier si la catégorie "Financement" existe déjà
    if (categories && !categories.some(cat => cat.name === "Financement")) {
      console.log("Ajout de la catégorie 'Financement'");
      // Cette approche est temporaire et n'ajoute la catégorie que dans l'UI
      // Pour un ajout permanent, il faudrait utiliser une requête à l'API ou une migration SQL
      return [...categories, {
        id: "financing",
        name: "Financement",
        icon: "currency-dollar",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }];
    }
    return categories;
  }, [categories]);
  
  return {
    // Données
    documents,
    categories: enhancedCategories,
    
    // États de chargement
    isLoadingDocuments,
    isLoadingCategories,
    isAdding,
    isDeleting,
    isUpdating,
    isViewing,
    isUploading,
    isDownloading,
    
    // Erreurs
    documentsError,
    categoriesError,
    
    // Actions
    addDocument,
    deleteDocument,
    updateDocument,
    viewDocument,
    uploadFile,
    downloadFile,
    refetchDocuments
  };
};

export default useVehicleDocuments;
