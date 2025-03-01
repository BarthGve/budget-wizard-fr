
import { supabase } from "@/integrations/supabase/client";
import { Contributor, NewContributor } from "@/types/contributor";

export const fetchContributorsService = async () => {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!user) throw new Error("Non authentifié");

  // Optimize by selecting only the columns we actually need
  const { data, error } = await supabase
    .from("contributors")
    .select("id, name, email, total_contribution, percentage_contribution, is_owner, profile_id")
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
  console.log("Recalcul des pourcentages pour l'utilisateur:", userId);
  
  // Exécuter le calcul côté serveur avec une seule requête SQL pour plus d'efficacité
  const { error } = await supabase.rpc('update_contributor_percentages', {
    profile_id_param: userId
  });
  
  if (error) {
    console.error("Erreur lors du recalcul des pourcentages:", error);
    throw error;
  }
  
  console.log("Pourcentages recalculés avec succès");
  return true;
};

export const addContributorService = async (
  newContributor: NewContributor,
  userId: string
) => {
  // On ne vérifie l'unicité de l'email que s'il est fourni et non vide
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
        email: newContributor.email ? newContributor.email.trim() : null,
        total_contribution: contribution,
        profile_id: userId,
      },
    ])
    .select()
    .single();

  if (insertError) throw insertError;
  if (!insertedContributor) throw new Error("Erreur lors de l'ajout du contributeur");

  // Le déclencheur SQL va maintenant recalculer les pourcentages
  // Pas besoin de recharger tous les contributeurs, on renvoie juste l'état actuel
  return await fetchContributorsService();
};

export const updateContributorService = async (contributor: Contributor) => {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!user) throw new Error("Non authentifié");

  // Vérification d'email seulement si l'email est non vide et modifié
  if (contributor.email && contributor.email.trim() !== '') {
    const { data: existingContributor, error: existingError } = await supabase
      .from("contributors")
      .select("id")
      .eq("email", contributor.email.trim())
      .eq("profile_id", user.id)
      .neq("id", contributor.id) // Exclut le contributeur actuel
      .maybeSingle();

    if (existingError) throw existingError;
    if (existingContributor) {
      throw new Error("Un contributeur avec cet email existe déjà");
    }
  }

  // Optimisation des données à mettre à jour selon le type de contributeur
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

  // Le déclencheur SQL va recalculer les pourcentages
  // Renvoyer directement les contributeurs à jour
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

  // Le déclencheur SQL va recalculer les pourcentages
  // Renvoyer directement les contributeurs à jour
  return await fetchContributorsService();
};
