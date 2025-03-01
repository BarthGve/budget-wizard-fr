
import { supabase } from "@/integrations/supabase/client";
import { Contributor, NewContributor } from "@/types/contributor";

export const fetchContributorsService = async () => {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!user) throw new Error("Non authentifié");

  const { data, error } = await supabase
    .from("contributors")
    .select("*")
    .eq("profile_id", user.id)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data || [];
};

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
    (sum, contributor) => sum + contributor.total_contribution, 
    0
  );
  
  console.log("Total des contributions:", totalContributions);
  
  // 3. Mettre à jour les pourcentages individuels
  if (totalContributions > 0) {
    // Correction: utiliser des mises à jour individuelles pour une précision maximale
    for (const contributor of contributors) {
      const percentage = (contributor.total_contribution / totalContributions) * 100;
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

export const addContributorService = async (
  newContributor: NewContributor,
  userId: string
) => {
  // On ne vérifie l'unicité de l'email que s'il est fourni
  if (newContributor.email && newContributor.email.trim() !== '') {
    const { data: existingContributor, error: existingError } = await supabase
      .from("contributors")
      .select("id")
      .eq("email", newContributor.email.trim())
      .eq("profile_id", userId)
      .maybeSingle();

    if (existingError) throw existingError;
    if (existingContributor) {
      throw new Error("Un contributeur avec cet email existe déjà");
    }
  }

  const contribution = parseFloat(newContributor.total_contribution);

  const { data: insertedContributor, error: insertError } = await supabase
    .from("contributors")
    .insert([
      {
        name: newContributor.name,
        email: newContributor.email ? newContributor.email.trim() : null, // On s'assure que l'email est null si vide
        total_contribution: contribution,
        profile_id: userId,
      },
    ])
    .select()
    .single();

  if (insertError) throw insertError;
  if (!insertedContributor) throw new Error("Erreur lors de l'ajout du contributeur");

  // Recalculer les pourcentages manuellement
  await recalculatePercentages(userId);

  return await fetchContributorsService();
};

export const updateContributorService = async (contributor: Contributor) => {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!user) throw new Error("Non authentifié");

  // Pour la mise à jour, on vérifie aussi l'unicité de l'email s'il est modifié
  if (contributor.email && contributor.email.trim() !== '') {
    const { data: existingContributor, error: existingError } = await supabase
      .from("contributors")
      .select("id")
      .eq("email", contributor.email.trim())
      .eq("profile_id", user.id)
      .neq("id", contributor.id) // On exclut le contributeur actuel
      .maybeSingle();

    if (existingError) throw existingError;
    if (existingContributor) {
      throw new Error("Un contributeur avec cet email existe déjà");
    }
  }

  const updateData = contributor.is_owner
    ? { total_contribution: contributor.total_contribution }
    : {
        name: contributor.name,
        email: contributor.email ? contributor.email.trim() : null,
        total_contribution: contributor.total_contribution,
      };

  const { error: updateError } = await supabase
    .from("contributors")
    .update(updateData)
    .eq("id", contributor.id)
    .eq("profile_id", user.id);

  if (updateError) throw updateError;

  // Recalculer les pourcentages manuellement
  await recalculatePercentages(user.id);

  return await fetchContributorsService();
};

export const deleteContributorService = async (contributorId: string) => {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!user) throw new Error("Non authentifié");

  const { error: deleteError } = await supabase
    .from("contributors")
    .delete()
    .eq("id", contributorId)
    .eq("profile_id", user.id);

  if (deleteError) throw deleteError;

  // Recalculer les pourcentages manuellement
  await recalculatePercentages(user.id);

  return await fetchContributorsService();
};
