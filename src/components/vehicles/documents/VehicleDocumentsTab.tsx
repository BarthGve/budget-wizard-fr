
import React, { useState } from "react";
import { useVehicleDocuments } from "@/hooks/useVehicleDocuments";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { VehicleDocumentsGrid } from "./VehicleDocumentsGrid";
import { VehicleDocumentCategory, VehicleDocument } from "@/types/vehicle-documents";
import { AddDocumentDialog } from "./AddDocumentDialog";
import { FileIcon, FolderIcon } from "lucide-react";

interface VehicleDocumentsTabProps {
  vehicleId: string;
}

export const VehicleDocumentsTab = ({ vehicleId }: VehicleDocumentsTabProps) => {
  const {
    documents,
    isLoadingDocuments,
    categories,
    isLoadingCategories,
  } = useVehicleDocuments(vehicleId);
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };
  
  // Filtrer les documents par catégorie
  const filteredDocuments = documents?.filter(doc => 
    !selectedCategory || doc.category_id === selectedCategory
  );

  // Fonction pour obtenir l'icône correspondante à une catégorie
  const getCategoryIcon = (iconName: string) => {
    return iconName || "file";
  };

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold mb-4">Documents du véhicule</h2>
          <AddDocumentDialog vehicleId={vehicleId} />
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        {/* Filtres de catégories */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          <button
            className={cn(
              "px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 whitespace-nowrap",
              "border transition-colors",
              !selectedCategory 
                ? "bg-gray-100 border-gray-300 text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                : "border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800/60"
            )}
            onClick={() => setSelectedCategory(null)}
          >
            <FileIcon className="w-4 h-4" />
            Tous les documents
          </button>
          
          {categories?.map((category) => (
            <button
              key={category.id}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 whitespace-nowrap",
                "border transition-colors",
                selectedCategory === category.id
                  ? "bg-gray-100 border-gray-300 text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800/60"
              )}
              onClick={() => setSelectedCategory(category.id)}
            >
              <FolderIcon className="w-4 h-4" />
              {category.name}
            </button>
          ))}
        </div>
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <VehicleDocumentsGrid 
          documents={filteredDocuments || []} 
          isLoading={isLoadingDocuments} 
          vehicleId={vehicleId}
        />
      </motion.div>
    </motion.div>
  );
};
