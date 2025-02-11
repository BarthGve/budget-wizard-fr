
import { supabase } from "@/integrations/supabase/client";
import { Contributor, NewContributor } from "@/types/contributor";

export const fetchContributorsService = async () => {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!user) throw new Error("Non authentifié");

  const { data, error } = await supabase
    .from("contributors")
    .select("*")
    .eq("profile_id", user.id)  // Ajout du filtre par profile_id
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data || [];
};

export const addContributorService = async (
  newContributor: NewContributor,
  userId: string
) => {
  if (newContributor.email) {
    const { data: existingContributor, error: existingError } = await supabase
      .from("contributors")
      .select("id")
      .eq("email", newContributor.email)
      .eq("profile_id", userId)  // Ajout du filtre par profile_id
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
    .select()
    .single();

  if (insertError) throw insertError;
  if (!insertedContributor) throw new Error("Erreur lors de l'ajout du contributeur");

  const { error: updateError } = await supabase
    .rpc('update_contributor_percentages', {
      profile_id_param: userId
    });

  if (updateError) throw updateError;

  return await fetchContributorsService();
};

export const updateContributorService = async (contributor: Contributor) => {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!user) throw new Error("Non authentifié");

  const updateData = contributor.is_owner
    ? { total_contribution: contributor.total_contribution }
    : {
        name: contributor.name,
        email: contributor.email,
        total_contribution: contributor.total_contribution,
      };

  const { error: updateError } = await supabase
    .from("contributors")
    .update(updateData)
    .eq("id", contributor.id)
    .eq("profile_id", user.id);  // Ajout du filtre par profile_id

  if (updateError) throw updateError;

  const { error: percentageError } = await supabase
    .rpc('update_contributor_percentages', {
      profile_id_param: user.id
    });

  if (percentageError) throw percentageError;

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
    .eq("profile_id", user.id);  // Ajout du filtre par profile_id

  if (deleteError) throw deleteError;

  const { error: percentageError } = await supabase
    .rpc('update_contributor_percentages', {
      profile_id_param: user.id
    });

  if (percentageError) throw percentageError;

  return await fetchContributorsService();
};
