
import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { VehicleDocument } from "@/types/vehicle-documents";
import { Button } from "@/components/ui/button";
import { FileIcon, Download, Calendar, Trash2, ExternalLink, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useDocumentTypes } from "@/hooks/useDocumentTypes";
import { downloadFile } from "./DocumentCardHelpers";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DocumentCardProps {
  document: VehicleDocument;
  vehicleId: string;
  onDeleted?: () => void;
}

export const DocumentCard = ({ document, vehicleId, onDeleted }: DocumentCardProps) => {
  const { getDocumentType } = useDocumentTypes();
  const documentType = getDocumentType(document.file_path);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  // Fonction pour télécharger le fichier
  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      
      // Correction du bucket: "vehicle-documents" au lieu de "vehicle_documents"
      const { data, error } = await supabase.storage
        .from('vehicle-documents')
        .download(document.file_path);
        
      if (error) {
        console.error("Erreur de téléchargement:", error);
        throw error;
      }
      
      // Utiliser la fonction helper pour télécharger le fichier
      downloadFile(data, document.name || 'document');
      
      toast.success(`Le document "${document.name}" a été téléchargé.`);
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
      toast.error("Impossible de télécharger le document.");
    } finally {
      setIsDownloading(false);
    }
  };
  
  // Fonction pour obtenir l'URL de prévisualisation et ouvrir dans un nouvel onglet
  const handlePreview = async () => {
    try {
      setIsLoadingPreview(true);
      
      // Correction du bucket: "vehicle-documents" au lieu de "vehicle_documents"
      const { data, error } = await supabase
        .storage
        .from('vehicle-documents')
        .createSignedUrl(document.file_path, 60 * 5); // URL valide pendant 5 minutes
        
      if (error) {
        console.error("Erreur de création d'URL signée:", error);
        throw error;
      }
      
      setPreviewUrl(data.signedUrl);
      
      // Ouvrir l'URL dans un nouvel onglet
      window.open(data.signedUrl, '_blank');
    } catch (error) {
      console.error("Erreur lors de la prévisualisation:", error);
      toast.error("Impossible de prévisualiser ce document.");
    } finally {
      setIsLoadingPreview(false);
    }
  };
  
  // Fonction pour supprimer le document
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      
      // Correction du bucket: "vehicle-documents" au lieu de "vehicle_documents"
      const { error: storageError } = await supabase
        .storage
        .from('vehicle-documents')
        .remove([document.file_path]);

      if (storageError) {
        console.error("Erreur lors de la suppression du fichier:", storageError);
        toast.error("Erreur lors de la suppression du fichier.");
        return;
      }
      
      // 2. Supprimer les informations du document de la base de données
      const { error } = await supabase
        .from('vehicle_documents')
        .delete()
        .eq('id', document.id);

      if (error) throw error;
      
      toast.success(`Le document "${document.name}" a été supprimé.`);
      
      // Appeler le callback pour rafraîchir la liste si fourni
      if (onDeleted) onDeleted();
      
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error("Impossible de supprimer ce document.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-300 border border-gray-200 dark:border-gray-700 h-full",
      "bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-800 dark:to-gray-900/80",
      "hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600"
    )}>
      <CardHeader className="p-4 pb-2 space-y-0 flex flex-row items-start">
        <div className="p-3 rounded-md border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/70 shadow-sm mr-3">
          <documentType.icon className={`w-8 h-8 ${documentType.color}`} />
        </div>
        <div className="space-y-1 flex-1 min-w-0">
          <h3 className="font-medium text-base text-gray-800 dark:text-gray-100 line-clamp-2">
            {document.name}
          </h3>
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
            <Calendar className="w-3 h-3 mr-1" />
            {document.created_at 
              ? format(new Date(document.created_at), "d MMM yyyy", { locale: fr })
              : "Date inconnue"
            }
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-0 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
        {document.description || "Aucune description"}
      </CardContent>
      
      <CardFooter className="p-3 flex justify-between items-center border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/20">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          onClick={handleDownload}
          disabled={isDownloading}
        >
          {isDownloading ? (
            <Loader2 className="w-4 h-4 mr-1 animate-spin" />
          ) : (
            <Download className="w-4 h-4 mr-1" />
          )}
          {isDownloading ? "Téléchargement..." : "Télécharger"}
        </Button>
        
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 h-8 w-8 p-0"
            onClick={handlePreview}
            disabled={isLoadingPreview}
          >
            {isLoadingPreview ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ExternalLink className="w-4 h-4" />
            )}
            <span className="sr-only">Voir</span>
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-500/70 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 h-8 w-8 p-0"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                <span className="sr-only">Supprimer</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                <AlertDialogDescription>
                  Êtes-vous sûr de vouloir supprimer le document <strong>"{document.name}"</strong> ? Cette action est irréversible.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  Supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardFooter>
    </Card>
  );
};
