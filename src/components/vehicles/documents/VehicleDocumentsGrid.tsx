
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
  // Animation variants pour les cartes de document
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: "spring",
        stiffness: 70,
        damping: 15
      }
    },
    hover: {
      y: -5,
      scale: 1.02,
      transition: { 
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
        {[...Array(6)].map((_, index) => (
          <div 
            key={index}
            className="h-56 rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!documents.length) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center py-16 px-6 text-center bg-gray-50/50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800"
      >
        <div className="p-4 bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-full mb-4 shadow-sm border border-gray-200/70 dark:border-gray-700/50">
          <FolderIcon className="w-8 h-8 text-gray-500 dark:text-gray-400" />
        </div>
        <h3 className="text-xl font-medium text-gray-800 dark:text-gray-100 mb-2">
          Aucun document
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
          Vous n'avez pas encore ajouté de documents pour ce véhicule. Utilisez le bouton "Ajouter un document" ci-dessus pour commencer.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {documents.map((document) => (
        <motion.div
          key={document.id}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
        >
          <DocumentCard 
            document={document}
            vehicleId={vehicleId} 
          />
        </motion.div>
      ))}
    </motion.div>
  );
};
