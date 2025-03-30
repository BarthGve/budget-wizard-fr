
import React, { useState } from "react";
import { motion } from "framer-motion";
import { AddDocumentDialog } from "./AddDocumentDialog";
import useVehicleDocuments from "@/hooks/vehicle-documents";
import { DocumentCard } from "./DocumentCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Filter, FolderIcon } from "lucide-react";

interface VehicleDocumentsTabProps {
  vehicleId: string;
}

export const VehicleDocumentsTab = ({ vehicleId }: VehicleDocumentsTabProps) => {
  const {
    documents,
    categories,
    isLoadingDocuments,
    isLoadingCategories,
  } = useVehicleDocuments(vehicleId);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
      },
    },
  };

  // Filtrer les documents par catégorie si une catégorie est sélectionnée
  const filteredDocuments = selectedCategory 
    ? documents?.filter(doc => doc.category_id === selectedCategory) 
    : documents;
  
  // Obtenir le nombre de documents par catégorie
  const getDocumentCountByCategory = (categoryId: string) => {
    return documents?.filter(doc => doc.category_id === categoryId).length || 0;
  };

  const handleRefresh = () => {
    // Le hook useVehicleDocuments gère déjà le rechargement des documents
    window.location.reload();
  };

  const renderDocumentGrid = () => {
    if (isLoadingDocuments) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((_, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center space-x-3">
                <Skeleton className="h-10 w-10 rounded-md" />
                <Skeleton className="h-6 w-full" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <div className="flex justify-between pt-2">
                <Skeleton className="h-8 w-24" />
                <div className="flex space-x-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (!filteredDocuments?.length) {
      return (
        <div className="text-center py-12 border border-dashed rounded-lg bg-gray-50 dark:bg-gray-800/30">
          <FolderIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-200">
            {selectedCategory 
              ? "Aucun document dans cette catégorie" 
              : "Aucun document trouvé"}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {selectedCategory
              ? "Essayez une autre catégorie ou ajoutez un nouveau document."
              : "Commencez par ajouter votre premier document."}
          </p>
          <div className="mt-6">
            <AddDocumentDialog vehicleId={vehicleId} />
          </div>
        </div>
      );
    }

    return (
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {filteredDocuments?.map((document) => (
          <motion.div key={document.id} variants={itemVariants}>
            <DocumentCard 
              document={document} 
              vehicleId={vehicleId}
              onDeleted={handleRefresh}
            />
          </motion.div>
        ))}
      </motion.div>
    );
  };

  const renderCategoryFilters = () => {
    if (isLoadingCategories || !categories?.length) {
      return (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[1, 2, 3, 4].map((_, index) => (
            <Skeleton key={index} className="h-8 w-24 rounded-full" />
          ))}
        </div>
      );
    }

    return (
      <div className="flex gap-2 overflow-x-auto pb-3">
        <Button
          size="sm"
          variant={selectedCategory === null ? "default" : "outline"}
          className="rounded-full"
          onClick={() => setSelectedCategory(null)}
        >
          {selectedCategory === null && <Check className="mr-1 h-4 w-4" />}
          Tous ({documents?.length || 0})
        </Button>
        
        {categories.map((category) => {
          const count = getDocumentCountByCategory(category.id);
          const isActive = selectedCategory === category.id;
          
          return (
            <Button
              key={category.id}
              size="sm"
              variant={isActive ? "default" : "outline"}
              className={`rounded-full whitespace-nowrap ${count === 0 ? 'opacity-60' : ''}`}
              onClick={() => setSelectedCategory(isActive ? null : category.id)}
              disabled={count === 0}
            >
              {isActive && <Check className="mr-1 h-4 w-4" />}
              {category.name} ({count})
            </Button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-medium flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-500" />
            Filtrer par catégorie
          </h2>
          {selectedCategory && (
            <Badge 
              variant="outline" 
              className="ml-2 cursor-pointer" 
              onClick={() => setSelectedCategory(null)}
            >
              Effacer le filtre
            </Badge>
          )}
        </div>
        <AddDocumentDialog vehicleId={vehicleId} />
      </div>
      
      {renderCategoryFilters()}
      {renderDocumentGrid()}
    </div>
  );
};
