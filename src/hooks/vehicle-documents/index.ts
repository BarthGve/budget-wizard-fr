
import { useMemo } from 'react';
import {
  useDocumentDelete,
  useDocumentUrl,
  useDocumentUpdate
} from './operations';
import {
  useDocumentCategoriesQuery,
  useVehicleDocumentsQuery,
} from './queries';
import { useDocumentUpload } from './upload';

// Hook principal pour gérer les documents des véhicules
export const useVehicleDocuments = (vehicleId: string) => {
  // Récupérer les documents du véhicule
  const { 
    data: documents, 
    isLoading: isLoadingDocuments, 
    error: documentsError,
    refetch: refetchDocuments 
  } = useVehicleDocumentsQuery(vehicleId);
  
  // Récupérer les catégories de documents
  const { 
    data: categories, 
    isLoading: isLoadingCategories, 
    error: categoriesError 
  } = useDocumentCategoriesQuery();
  
  // Opérations de base de données
  const { addDocument, isAdding, isUploading } = useDocumentUpload(vehicleId);
  const { deleteDocument, isDeleting } = useDocumentDelete(vehicleId);
  const { updateDocument, isUpdating } = useDocumentUpdate(vehicleId);
  const { getDocumentUrl } = useDocumentUrl();
  
  return {
    // Données
    documents,
    categories,
    
    // États de chargement
    isLoadingDocuments,
    isLoadingCategories,
    isAdding,
    isDeleting,
    isUpdating,
    isUploading,
    
    // Erreurs
    documentsError,
    categoriesError,
    
    // Actions
    addDocument,
    deleteDocument,
    updateDocument,
    getDocumentUrl,
    refetchDocuments
  };
};

export default useVehicleDocuments;
