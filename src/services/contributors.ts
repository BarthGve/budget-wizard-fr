
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

export const addContributorService = async (
  newContributor: NewContributor,
  userId: string,
  currentContributors: Contributor[]
) => {
  if (newContributor.email) {
    const { data: existingContributor, error: existingError } = await supabase
      .from("contributors")
      .select("id")
      .eq("email", newContributor.email)
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
        email: newContributor.email,
        total_contribution: contribution,
        profile_id: userId,
      },
    ])
    .select("*")
    .single();

  if (insertError) throw insertError;
  if (!insertedContributor) throw new Error("Erreur lors de l'ajout du contributeur");

  // Appeler la fonction pour mettre à jour les pourcentages
  const { error: updateError } = await supabase
    .rpc('update_contributor_percentages', {
      profile_id_param: userId
    });

  if (updateError) throw updateError;
  
  return await fetchContributorsService();
};

export const updateContributorService = async (
  contributor: Contributor,
  currentContributors: Contributor[]
) => {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!user) throw new Error("Non authentifié");

  // Mettre à jour la contribution
  const { error: updateError } = await supabase
    .from("contributors")
    .update({
      total_contribution: contributor.total_contribution,
      ...(contributor.is_owner ? {} : {
        name: contributor.name,
        email: contributor.email,
      })
    })
    .eq("id", contributor.id)
    .eq("profile_id", user.id);

  if (updateError) throw updateError;

  // Mettre à jour les pourcentages avec la nouvelle fonction
  const { error: percentageError } = await supabase
    .rpc('update_contributor_percentages', {
      profile_id_param: user.id
    });

  if (percentageError) throw percentageError;

  return await fetchContributorsService();
};

export const deleteContributorService = async (
  contributorId: string,
  currentContributors: Contributor[]
) => {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!user) throw new Error("Non authentifié");

  const contributorToDelete = currentContributors.find(
    (c) => c.id === contributorId
  );
  if (!contributorToDelete) throw new Error("Contributeur non trouvé");
  if (contributorToDelete.is_owner) {
    throw new Error("Impossible de supprimer le propriétaire");
  }

  const { error: deleteError } = await supabase
    .from("contributors")
    .delete()
    .eq("id", contributorId)
    .eq("profile_id", user.id);

  if (deleteError) throw deleteError;

  // Mettre à jour les pourcentages après la suppression
  const { error: percentageError } = await supabase
    .rpc('update_contributor_percentages', {
      profile_id_param: user.id
    });

  if (percentageError) throw percentageError;

  return await fetchContributorsService();
};
