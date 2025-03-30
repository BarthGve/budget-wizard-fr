
import { useState, useEffect } from "react";
import { useVehicleDocuments } from "@/hooks/vehicle-documents";
import { DocumentCard } from "./DocumentCard";
import { Button } from "@/components/ui/button";
import { FilePlus2, Loader2, AlertTriangle } from "lucide-react";
import { AddDocumentDialog } from "./AddDocumentDialog";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { checkVehicleDocumentsBucket } from "@/hooks/vehicle-documents/checkBucket";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface VehicleDocumentsTabProps {
  vehicleId: string;
}

export const VehicleDocumentsTab = ({ vehicleId }: VehicleDocumentsTabProps) => {
  const { currentUser } = useCurrentUser();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [bucketStatus, setBucketStatus] = useState<{
    checked: boolean;
    exists: boolean;
    accessible?: boolean;
    error?: any;
  }>({ checked: false, exists: false });

  const {
    documents,
    isLoadingDocuments,
    documentsError,
    categories,
    isLoadingCategories,
    refetchDocuments
  } = useVehicleDocuments(vehicleId);

  // Vérifier le bucket au chargement
  useEffect(() => {
    const verifyBucket = async () => {
      const status = await checkVehicleDocumentsBucket();
      setBucketStatus({
        checked: true,
        exists: status.exists,
        accessible: status.accessible,
        error: status.error
      });
    };
    
    verifyBucket();
  }, []);

  // Gestionnaire pour l'ajout réussi d'un document
  const handleDocumentAdded = () => {
    console.log("Document ajouté avec succès, rafraîchissement des données...");
    refetchDocuments();
    setIsAddDialogOpen(false);
  };

  // Vérifier s'il y a des documents
  const hasDocuments = documents && documents.length > 0;

  // Afficher un message d'erreur si le bucket n'existe pas
  if (bucketStatus.checked && !bucketStatus.exists) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Erreur de configuration</AlertTitle>
        <AlertDescription>
          Le bucket de stockage "vehicle-documents" n'existe pas dans Supabase. 
          Veuillez contacter l'administrateur système pour résoudre ce problème.
        </AlertDescription>
      </Alert>
    );
  }

  // Afficher un message d'erreur si le bucket n'est pas accessible
  if (bucketStatus.checked && bucketStatus.exists && !bucketStatus.accessible) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Erreur d'accès</AlertTitle>
        <AlertDescription>
          Le bucket "vehicle-documents" existe mais n'est pas accessible. 
          Vérifiez les politiques d'accès dans Supabase.
          Erreur: {bucketStatus.error && bucketStatus.error.message}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec bouton d'ajout */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold">Documents du véhicule</h2>
        
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
          className="gap-2"
        >
          <FilePlus2 className="h-4 w-4" /> Ajouter un document
        </Button>
        
        <AddDocumentDialog 
          vehicleId={vehicleId}
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onDocumentAdded={handleDocumentAdded}
        />
      </div>
      
      {/* État de chargement */}
      {(isLoadingDocuments || isLoadingCategories) && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">Chargement des documents...</span>
        </div>
      )}
      
      {/* Message d'erreur */}
      {documentsError && (
        <div className="p-6 text-center">
          <AlertTriangle className="h-12 w-12 mx-auto text-red-500" />
          <h3 className="mt-2 text-lg font-semibold">Une erreur est survenue</h3>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Impossible de charger les documents du véhicule.
          </p>
          <Button 
            className="mt-4" 
            variant="outline"
            onClick={() => refetchDocuments()}
          >
            Réessayer
          </Button>
        </div>
      )}
      
      {/* Pas de documents */}
      {!isLoadingDocuments && !documentsError && !hasDocuments && (
        <div className="p-8 text-center border border-dashed rounded-lg">
          <FilePlus2 className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <h3 className="text-lg font-medium">Aucun document</h3>
          <p className="mt-1 mb-4 text-gray-600 dark:text-gray-400">
            Vous n'avez pas encore ajouté de documents pour ce véhicule.
          </p>
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            variant="outline"
            size="sm"
          >
            Ajouter un document
          </Button>
        </div>
      )}
      
      {/* Liste des documents */}
      {!isLoadingDocuments && !documentsError && hasDocuments && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map(document => (
            <DocumentCard 
              key={document.id} 
              document={document} 
              vehicleId={vehicleId} 
              onDeleted={refetchDocuments}
            />
          ))}
        </div>
      )}
      
      {/* Dialog d'ajout de document (version mobile) */}
      <div className="md:hidden fixed bottom-6 right-6">
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
          size="icon"
          className="h-14 w-14 rounded-full shadow-lg"
        >
          <FilePlus2 className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};
