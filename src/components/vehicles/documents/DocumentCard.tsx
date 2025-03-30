
import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { VehicleDocument } from "@/types/vehicle-documents";
import { Button } from "@/components/ui/button";
import { FileIcon, Download, Calendar, Trash2, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/toaster";

interface DocumentCardProps {
  document: VehicleDocument;
  vehicleId: string;
}

export const DocumentCard = ({ document, vehicleId }: DocumentCardProps) => {
  const { toast } = useToast();
  
  // Fonction pour déterminer l'icône du fichier selon son type
  const getFileIcon = () => {
    const extension = document.file_path.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'pdf':
        return <FileIcon className="w-8 h-8 text-red-500/80" />;
      case 'doc':
      case 'docx':
        return <FileIcon className="w-8 h-8 text-blue-500/80" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
        return <FileIcon className="w-8 h-8 text-green-500/80" />;
      default:
        return <FileIcon className="w-8 h-8 text-gray-500/80" />;
    }
  };
  
  // Fonction pour télécharger le fichier
  const handleDownload = async () => {
    try {
      const { data, error } = await supabase.storage
        .from('vehicle-documents')
        .download(document.file_path);
        
      if (error) throw error;
      
      // Créer un lien de téléchargement
      const url = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = document.name || 'document';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Téléchargement réussi",
        description: `Le document "${document.name}" a été téléchargé.`,
      });
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
      toast({
        title: "Erreur de téléchargement",
        description: "Impossible de télécharger le document.",
        variant: "destructive",
      });
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
          {getFileIcon()}
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
        >
          <Download className="w-4 h-4 mr-1" />
          Télécharger
        </Button>
        
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 h-8 w-8 p-0"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="sr-only">Voir</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="text-red-500/70 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 h-8 w-8 p-0"
          >
            <Trash2 className="w-4 h-4" />
            <span className="sr-only">Supprimer</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
