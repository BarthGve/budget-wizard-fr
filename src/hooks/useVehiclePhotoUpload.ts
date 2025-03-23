
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useVehiclePhotoUpload = (userId: string | undefined) => {
  const [isUploading, setIsUploading] = useState(false);

  const uploadPhoto = async (file: File): Promise<string | null> => {
    if (!userId) {
      toast.error("Vous devez être connecté pour télécharger une photo");
      return null;
    }

    setIsUploading(true);

    try {
      // Création d'un nom de fichier unique
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`; 

      // Vérification du type de fichier (uniquement images)
      if (!file.type.startsWith('image/')) {
        throw new Error('Seules les images sont autorisées');
      }

      // Vérification de la taille du fichier (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('La taille du fichier ne doit pas dépasser 5MB');
      }

      console.log("Téléchargement de l'image...", filePath);

      // Upload de l'image
      const { error: uploadError, data } = await supabase.storage
        .from('vehicle_photos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        console.error("Erreur d'upload:", uploadError);
        throw uploadError;
      }

      console.log("Image téléchargée avec succès:", data);

      // Récupération de l'URL publique de l'image
      const { data: urlData } = supabase.storage
        .from('vehicle_photos')
        .getPublicUrl(filePath);

      console.log("URL publique générée:", urlData.publicUrl);
      
      toast.success("Photo téléchargée avec succès");
      return urlData.publicUrl;
    } catch (error: any) {
      console.error("Erreur complète:", error);
      toast.error(`Erreur lors du téléchargement de la photo: ${error.message}`);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    isUploading,
    uploadPhoto
  };
};
