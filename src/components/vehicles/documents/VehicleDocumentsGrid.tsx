
import { VehicleDocument } from "@/types/vehicle-documents";
import { DocumentCard } from "./DocumentCard";
import { motion } from "framer-motion";
import { FolderIcon } from "lucide-react";

interface VehicleDocumentsGridProps {
  documents: VehicleDocument[];
  isLoading: boolean;
  vehicleId: string;
}

export const VehicleDocumentsGrid = ({ 
  documents, 
  isLoading,
  vehicleId 
}: VehicleDocumentsGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(4)].map((_, index) => (
          <div 
            key={index}
            className="h-48 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!documents.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full mb-3">
          <FolderIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          Aucun document
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mt-1">
          Vous n'avez pas encore ajouté de documents pour ce véhicule. Utilisez le bouton "Ajouter un document" ci-dessus.
        </p>
      </div>
    );
  }

  return (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {documents.map((document) => (
        <DocumentCard 
          key={document.id} 
          document={document}
          vehicleId={vehicleId} 
        />
      ))}
    </motion.div>
  );
};
