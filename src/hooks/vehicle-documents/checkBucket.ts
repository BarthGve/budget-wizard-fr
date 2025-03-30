
import { supabase } from "@/integrations/supabase/client";

export const checkVehicleDocumentsBucket = async () => {
  try {
    console.log("Vérification du bucket vehicle-documents...");
    
    // Liste des buckets disponibles
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error("Erreur lors de la récupération des buckets:", bucketsError);
      return { exists: false, error: bucketsError };
    }
    
    console.log("Buckets disponibles:", buckets.map(b => b.name));
    
    // Vérifier si notre bucket existe
    const bucketExists = buckets.some(bucket => bucket.name === 'vehicle-documents');
    
    if (!bucketExists) {
      console.error("Le bucket 'vehicle-documents' n'existe pas!");
      return { exists: false, error: "Bucket non trouvé" };
    }
    
    // Essayer de lister les fichiers pour confirmer les permissions
    const { data: files, error: filesError } = await supabase.storage
      .from('vehicle-documents')
      .list();
      
    if (filesError) {
      console.error("Erreur lors de l'accès au bucket:", filesError);
      return { exists: true, accessible: false, error: filesError };
    }
    
    console.log("Accès au bucket confirmé. Fichiers disponibles:", files.length);
    return { exists: true, accessible: true, files };
    
  } catch (err) {
    console.error("Erreur lors de la vérification du bucket:", err);
    return { exists: false, error: err };
  }
};
