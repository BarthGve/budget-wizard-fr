
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
