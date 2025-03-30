
import React, { useState } from "react";
import { useVehicleDocuments } from "@/hooks/useVehicleDocuments";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { VehicleDocumentsGrid } from "./VehicleDocumentsGrid";
import { VehicleDocumentCategory, VehicleDocument } from "@/types/vehicle-documents";
import { AddDocumentDialog } from "./AddDocumentDialog";
import { FileIcon, FolderIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";

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

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <Card className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2.5">
                <div className="p-2 rounded-md bg-gray-100 dark:bg-gray-800">
                  <FileIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                </div>
                Documents du véhicule
              </h2>
              <AddDocumentDialog vehicleId={vehicleId} />
            </div>
            
            <Separator className="my-4 bg-gray-200/70 dark:bg-gray-700/50" />
            
            {/* Filtres de catégories améliorés */}
            <div className="flex flex-wrap gap-2 pt-1 pb-1 overflow-x-auto">
              <button
                className={cn(
                  "px-3.5 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all duration-200",
                  "border shadow-sm",
                  !selectedCategory 
                    ? "bg-gray-200/80 border-gray-300/80 text-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                    : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700/70"
                )}
                onClick={() => setSelectedCategory(null)}
              >
                <FileIcon className="w-4 h-4 opacity-70" />
                Tous les documents
              </button>
              
              {categories?.map((category) => (
                <button
                  key={category.id}
                  className={cn(
                    "px-3.5 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all duration-200",
                    "border shadow-sm",
                    selectedCategory === category.id
                      ? "bg-gray-200/80 border-gray-300/80 text-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                      : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700/70"
                  )}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <div className="flex items-center justify-center w-4 h-4 rounded-sm bg-gray-100 dark:bg-gray-700/50">
                    <FolderIcon className="w-3 h-3" />
                  </div>
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </Card>
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
