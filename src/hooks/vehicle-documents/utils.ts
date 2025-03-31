
import { toast } from "@/components/ui/use-toast";

export const handleError = (error: any, defaultMessage: string) => {
  const errorMessage = error?.message || defaultMessage;
  toast({
    title: "Erreur",
    description: errorMessage,
    variant: "destructive"
  });
  return errorMessage;
};

export const showSuccess = (message: string) => {
  toast({
    title: "Succès",
    description: message
  });
  return message;
};

/**
 * Nettoie un nom de fichier pour éviter les problèmes avec Supabase Storage
 * - Remplace les caractères spéciaux
 * - Limite la longueur du nom de fichier
 */
export const sanitizeFileName = (fileName: string): string => {
  // Remplace les caractères non alphanumériques (sauf . et -) par des underscores
  let cleanName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  
  // Supprime les espaces multiples
  cleanName = cleanName.replace(/\s+/g, '_');
  
  // Limite la longueur du nom de fichier à 100 caractères
  const maxLength = 100;
  if (cleanName.length > maxLength) {
    // Préserve l'extension de fichier
    const lastDotIndex = cleanName.lastIndexOf('.');
    if (lastDotIndex !== -1) {
      const extension = cleanName.substring(lastDotIndex);
      const nameWithoutExtension = cleanName.substring(0, lastDotIndex);
      
      // Tronque le nom sans l'extension pour s'assurer que le nom complet reste sous maxLength
      const truncatedName = nameWithoutExtension.substring(0, maxLength - extension.length);
      cleanName = truncatedName + extension;
    } else {
      // Pas d'extension, simplement tronquer
      cleanName = cleanName.substring(0, maxLength);
    }
  }
  
  return cleanName;
};
