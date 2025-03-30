
import React, { useState } from "react";
import { useVehicleDocuments } from "@/hooks/useVehicleDocuments";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { VehicleDocumentsGrid } from "./VehicleDocumentsGrid";
import { VehicleDocumentCategory } from "@/types/vehicle-documents";
import { AddDocumentDialog } from "./AddDocumentDialog";
import { FileIcon, FolderIcon, PlusCircle, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

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
  const [showCategories, setShowCategories] = useState(false);
  const isMobile = useIsMobile();
  
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

  // Gestion de la sélection de catégorie
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId === "all" ? null : categoryId);
  };

  // Rendu des catégories adapté pour mobile
  const renderCategorySelector = () => {
    if (isMobile) {
      return (
        <Select onValueChange={handleCategoryChange} value={selectedCategory || "all"}>
          <SelectTrigger className="w-full mb-4">
            <SelectValue placeholder="Toutes les catégories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les documents</SelectItem>
            {categories?.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }
    
    // Version desktop inchangée avec les filtres de catégories horizontaux
    return (
      <div className="flex gap-2 mb-6 overflow-x-auto py-1 px-0.5">
        <button
          className={cn(
            "px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 whitespace-nowrap transition-all",
            "border shadow-sm",
            !selectedCategory 
              ? "bg-gradient-to-r from-gray-100 to-gray-50 border-gray-300 text-gray-900 shadow-gray-100/80 dark:shadow-gray-900/20 dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-700 dark:border-gray-600 dark:text-gray-100"
              : "border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800/60 dark:hover:border-gray-600"
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
              "px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 whitespace-nowrap transition-all",
              "border shadow-sm",
              selectedCategory === category.id
                ? "bg-gradient-to-r from-gray-100 to-gray-50 border-gray-300 text-gray-900 shadow-gray-100/80 dark:shadow-gray-900/20 dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-700 dark:border-gray-600 dark:text-gray-100"
                : "border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800/60 dark:hover:border-gray-600"
            )}
            onClick={() => setSelectedCategory(category.id)}
          >
            <FolderIcon className="w-4 h-4" />
            {category.name}
          </button>
        ))}
      </div>
    );
  };

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-2">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
              Documents du véhicule
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Gérez tous les documents liés à votre véhicule
            </p>
          </div>
          
          <Button 
            onClick={() => {}} // Le composant AddDocumentDialog gérera l'ouverture
            className={cn(
              "h-10 px-4 border transition-all duration-200 rounded-md",
              "hover:scale-[1.02] active:scale-[0.98]",
              // Light mode
              "bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200 text-gray-700",
              "hover:border-gray-300 hover:bg-gray-50/50 hover:text-gray-800",
              // Dark mode
              "dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-750 dark:border-gray-700 dark:text-gray-300",
              "dark:hover:bg-gray-700/80 dark:hover:border-gray-600 dark:hover:text-gray-200",
              "shadow-sm"
            )}
          >
            <AddDocumentDialog vehicleId={vehicleId}>
              <div className="flex items-center gap-1.5">
                <span className={cn(
                  "flex items-center justify-center w-5 h-5 rounded-md transition-colors",
                  // Light mode
                  "bg-gray-200/80 text-gray-700",
                  // Dark mode
                  "dark:bg-gray-700/70 dark:text-gray-300"
                )}>
                  <PlusCircle className="h-3.5 w-3.5" />
                </span>
                <span className="font-medium text-sm">Ajouter un document</span>
              </div>
            </AddDocumentDialog>
          </Button>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        {/* Sélecteur de catégories optimisé pour mobile */}
        {renderCategorySelector()}
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
