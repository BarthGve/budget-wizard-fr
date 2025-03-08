
import { supabase } from "@/integrations/supabase/client";

/**
 * Recalcule les pourcentages de contribution pour tous les contributeurs
 * d'un profil donné
 */
export const recalculatePercentages = async (userId: string) => {
  console.log("Recalcul manuel des pourcentages pour l'utilisateur:", userId);
  
  // 1. Récupérer tous les contributeurs
  const { data: contributors, error: fetchError } = await supabase
    .from("contributors")
    .select("id, total_contribution")
    .eq("profile_id", userId);
  
  if (fetchError) {
    console.error("Erreur lors de la récupération des contributeurs:", fetchError);
    throw fetchError;
  }
  
  if (!contributors || contributors.length === 0) {
    console.log("Aucun contributeur trouvé pour recalculer les pourcentages");
    return;
  }
  
  // 2. Calculer le total des contributions
  const totalContributions = contributors.reduce(
    (sum, contributor) => sum + (contributor.total_contribution || 0), 
    0
  );
  
  console.log("Total des contributions:", totalContributions);
  
  // 3. Mettre à jour les pourcentages individuels
  if (totalContributions > 0) {
    // Correction: utiliser des mises à jour individuelles pour une précision maximale
    for (const contributor of contributors) {
      const contribution = contributor.total_contribution || 0;
      const percentage = (contribution / totalContributions) * 100;
      console.log(`Mise à jour de ${contributor.id}: ${percentage.toFixed(2)}%`);
      
      await supabase
        .from("contributors")
        .update({ percentage_contribution: percentage })
        .eq("id", contributor.id);
    }
    
    console.log("Tous les pourcentages ont été recalculés avec succès");
  } else {
    // Si le total est 0, mettre tous les pourcentages à 0
    const { error: updateError } = await supabase
      .from("contributors")
      .update({ percentage_contribution: 0 })
      .eq("profile_id", userId);
      
    if (updateError) {
      console.error("Erreur lors de la mise à jour des pourcentages à 0:", updateError);
      throw updateError;
    }
    
    console.log("Tous les pourcentages ont été mis à 0 (total des contributions = 0)");
  }
  
  return true;
};
