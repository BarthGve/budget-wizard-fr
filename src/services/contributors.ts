
import { supabase } from "@/integrations/supabase/client";
import { Contributor, NewContributor } from "@/types/contributor";
import { encryptValue, decryptValue, getUserEncryptionKey, isEncryptionEnabled } from "@/services/encryption";

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
  
  // Vérifier si le chiffrement est activé
  const encryptionEnabled = await isEncryptionEnabled();
  
  // Si le chiffrement est activé, déchiffrer les données nécessaires
  if (encryptionEnabled) {
    const userKey = await getUserEncryptionKey(user.id);
    
    return (data || []).map(contributor => {
      // Déchiffrer seulement les données qui sont marquées comme chiffrées
      if (contributor.is_encrypted) {
        return {
          ...contributor,
          total_contribution: contributor.total_contribution_encrypted ? 
            decryptValue(contributor.total_contribution_encrypted, userKey, true) as number : 
            contributor.total_contribution
        };
      }
      return contributor;
    });
  }
  
  return data || [];
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
  
  // Vérifier si le chiffrement est activé
  const encryptionEnabled = await isEncryptionEnabled();
  
  let contributorData: any = {
    name: newContributor.name,
    email: newContributor.email ? newContributor.email.trim() : null, // On s'assure que l'email est null si vide
    total_contribution: contribution,
    profile_id: userId,
  };
  
  // Si le chiffrement est activé, chiffrer les données sensibles
  if (encryptionEnabled) {
    const userKey = await getUserEncryptionKey(userId);
    contributorData.total_contribution_encrypted = encryptValue(contribution, userKey);
    contributorData.is_encrypted = true;
  }

  const { data: insertedContributor, error: insertError } = await supabase
    .from("contributors")
    .insert([contributorData])
    .select()
    .single();

  if (insertError) throw insertError;
  if (!insertedContributor) throw new Error("Erreur lors de l'ajout du contributeur");

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

  // Vérifier si le chiffrement est activé
  const encryptionEnabled = await isEncryptionEnabled();
  
  let updateData: any = contributor.is_owner
    ? { total_contribution: contributor.total_contribution }
    : {
        name: contributor.name,
        email: contributor.email ? contributor.email.trim() : null,
        total_contribution: contributor.total_contribution,
      };
  
  // Si le chiffrement est activé, chiffrer les données sensibles
  if (encryptionEnabled) {
    const userKey = await getUserEncryptionKey(user.id);
    updateData.total_contribution_encrypted = encryptValue(contributor.total_contribution, userKey);
    updateData.is_encrypted = true;
  }

  const { error: updateError } = await supabase
    .from("contributors")
    .update(updateData)
    .eq("id", contributor.id)
    .eq("profile_id", user.id);

  if (updateError) throw updateError;

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

  return await fetchContributorsService();
};

/**
 * Service pour migrer les données existantes vers le format chiffré
 */
export const migrateContributorsToEncrypted = async (): Promise<void> => {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!user) throw new Error("Non authentifié");
  
  // Récupérer tous les contributeurs de l'utilisateur
  const { data: contributors, error } = await supabase
    .from("contributors")
    .select("*")
    .eq("profile_id", user.id)
    .eq("is_encrypted", false);
  
  if (error) throw error;
  if (!contributors || contributors.length === 0) return;
  
  // Générer la clé de chiffrement de l'utilisateur
  const userKey = await getUserEncryptionKey(user.id);
  
  // Préparer les mises à jour en lot
  const updates = contributors.map(contributor => ({
    id: contributor.id,
    total_contribution_encrypted: encryptValue(contributor.total_contribution, userKey),
    is_encrypted: true
  }));
  
  // Mettre à jour les contributeurs en lot
  for (const update of updates) {
    const { error: updateError } = await supabase
      .from("contributors")
      .update({
        total_contribution_encrypted: update.total_contribution_encrypted,
        is_encrypted: true
      })
      .eq("id", update.id)
      .eq("profile_id", user.id);
    
    if (updateError) throw updateError;
  }
  
  // Activer le chiffrement dans le profil utilisateur
  const { error: profileError } = await supabase
    .from("profiles")
    .update({ encryption_enabled: true })
    .eq("id", user.id);
  
  if (profileError) throw profileError;
};

/**
 * Service pour activer le chiffrement pour un utilisateur
 */
export const enableEncryption = async (): Promise<void> => {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!user) throw new Error("Non authentifié");
  
  // Migrer les données existantes
  await migrateContributorsToEncrypted();
  
  // Mettre à jour le profil utilisateur pour activer le chiffrement
  const { error } = await supabase
    .from("profiles")
    .update({ encryption_enabled: true })
    .eq("id", user.id);
  
  if (error) throw error;
};

/**
 * Service pour vérifier si le chiffrement est activé pour l'utilisateur
 */
export const checkEncryptionStatus = async (): Promise<boolean> => {
  return await isEncryptionEnabled();
};
