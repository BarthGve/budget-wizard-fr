
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useVehicleDocumentsQuery, useDocumentCategoriesQuery } from "./queries";
import { useDocumentUpload } from "./upload";
import { useDocumentDelete, useDocumentUrl } from "./operations";

export const useVehicleDocuments = (vehicleId: string) => {
  const { currentUser } = useCurrentUser();
  const userId = currentUser?.id;

  // Récupérer les documents et catégories
  const {
    data: documents,
    isLoading: isLoadingDocuments,
    error: documentsError,
    refetch: refetchDocuments
  } = useVehicleDocumentsQuery(vehicleId, userId);

  const {
    data: categories,
    isLoading: isLoadingCategories
  } = useDocumentCategoriesQuery();

  // Fonctionnalités d'upload
  const { addDocument, isAdding, isUploading } = useDocumentUpload(vehicleId, userId);

  // Fonctionnalités de suppression et d'URL
  const { deleteDocument, isDeleting } = useDocumentDelete(vehicleId);
  const { getDocumentUrl } = useDocumentUrl();

  return {
    // Documents et catégories
    documents,
    isLoadingDocuments,
    documentsError,
    categories,
    isLoadingCategories,
    refetchDocuments,
    
    // Actions
    addDocument,
    isAdding,
    deleteDocument,
    isDeleting,
    getDocumentUrl,
    isUploading
  };
};

// Réexporter le hook principal
export default useVehicleDocuments;
