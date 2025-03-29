
import { toast } from "sonner";

// Fonction pour nettoyer les noms de fichiers
export const sanitizeFileName = (fileName: string): string => {
  // Remplacer les caractères accentués et spéciaux
  return fileName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
    .replace(/[^\w.-]/g, '_'); // Remplacer les autres caractères spéciaux par des underscores
};

// Fonction pour traiter les erreurs
export const handleError = (error: any, message: string): void => {
  console.error(message, error);
  toast.error(message);
};

// Fonction pour afficher un message de succès
export const showSuccess = (message: string): void => {
  toast.success(message);
};
