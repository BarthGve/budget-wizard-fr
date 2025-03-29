
import { useState } from "react";
import { VehicleDocument, VehicleDocumentCategory } from "@/types/vehicle-documents";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useVehicleDocuments } from "@/hooks/useVehicleDocuments";
import { 
  FileIcon, 
  FileTextIcon,
  FileImage,
  ExternalLinkIcon, 
  Trash2Icon,
  ShieldIcon,
  WrenchIcon,
  FileIcon as FileIconAlias
} from "lucide-react";
import { motion } from "framer-motion";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter, AlertDialogCancel, AlertDialogAction, AlertDialogDescription } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface DocumentCardProps {
  document: VehicleDocument & { 
    vehicle_document_categories?: VehicleDocumentCategory 
  };
  vehicleId: string;
}

export const DocumentCard = ({ document, vehicleId }: DocumentCardProps) => {
  const { getDocumentUrl, deleteDocument, isDeleting } = useVehicleDocuments(vehicleId);
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const [isUrlLoading, setIsUrlLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const handleViewDocument = async () => {
    setIsUrlLoading(true);
    try {
      const url = await getDocumentUrl(document.file_path);
      if (url) {
        setDocumentUrl(url);
        window.open(url, "_blank");
      }
    } finally {
      setIsUrlLoading(false);
    }
  };

  const handleDeleteDocument = () => {
    deleteDocument(document);
    setIsDeleteDialogOpen(false);
  };
  
  // Déterminer l'icône en fonction du type de fichier
  const getDocumentIcon = () => {
    const contentType = document.content_type;
    if (!contentType) return <FileTextIcon className="w-12 h-12 text-gray-400" />;
    
    if (contentType.includes("pdf")) {
      return <FileTextIcon className="w-12 h-12 text-red-500" />;
    } else if (contentType.includes("image")) {
      return <FileImage className="w-12 h-12 text-blue-500" />;
    } else if (contentType.includes("text")) {
      return <FileTextIcon className="w-12 h-12 text-gray-500" />;
    } else {
      return <FileIcon className="w-12 h-12 text-gray-400" />;
    }
  };
  
  // Obtenir l'icône de la catégorie
  const getCategoryIcon = () => {
    const icon = document.vehicle_document_categories?.icon || "file";
    
    switch (icon) {
      case "file-text":
        return <FileTextIcon className="w-4 h-4" />;
      case "shield":
        return <ShieldIcon className="w-4 h-4" />;
      case "wrench":
        return <WrenchIcon className="w-4 h-4" />;
      case "tool":
        return <FileIconAlias className="w-4 h-4" />;
      default:
        return <FileIcon className="w-4 h-4" />;
    }
  };
  
  // Formater la taille du fichier
  const formatFileSize = (sizeInBytes?: number) => {
    if (!sizeInBytes) return "Taille inconnue";
    
    if (sizeInBytes < 1024) {
      return `${sizeInBytes} octets`;
    } else if (sizeInBytes < 1024 * 1024) {
      return `${(sizeInBytes / 1024).toFixed(1)} Ko`;
    } else {
      return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} Mo`;
    }
  };

  return (
    <>
      <motion.div whileHover={{ scale: 1.02 }} className="h-full">
        <Card className={cn(
          "h-full flex flex-col border border-gray-200 dark:border-gray-800",
          "hover:shadow-md transition-shadow"
        )}>
          <CardContent className="p-4 flex-1 flex flex-col">
            <div className="mb-3 flex justify-center">
              {getDocumentIcon()}
            </div>
            
            <h3 className="font-medium text-gray-900 dark:text-gray-100 text-center mb-2 line-clamp-2">
              {document.name}
            </h3>
            
            {document.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                {document.description}
              </p>
            )}
            
            <div className="mt-auto">
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500 mt-2">
                <span className="flex items-center gap-1">
                  {getCategoryIcon()}
                  <span>{document.vehicle_document_categories?.name || "Sans catégorie"}</span>
                </span>
              </div>
              
              <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {formatFileSize(document.file_size)}
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="p-3 border-t border-gray-100 dark:border-gray-800 gap-2 flex items-center">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full text-xs flex items-center gap-1"
              onClick={handleViewDocument}
              disabled={isUrlLoading}
            >
              <ExternalLinkIcon className="w-3.5 h-3.5" />
              Ouvrir
            </Button>
            
            <Button
              variant="ghost" 
              size="sm"
              className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2Icon className="w-4 h-4" />
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ce document ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le document sera définitivement supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteDocument}
              className="bg-red-500 hover:bg-red-600"
              disabled={isDeleting}
            >
              {isDeleting ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
