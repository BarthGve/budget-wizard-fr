
import { supabase } from "@/integrations/supabase/client";
import { NewContributor } from "@/types/contributor";
import { encryptValue, getUserEncryptionKey, isEncryptionEnabled } from "@/services/encryption";
import { fetchContributorsService } from "./fetch";

/**
 * Adds a new contributor
 */
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
    profile_id: userId,
    // On doit toujours inclure total_contribution pour que les triggers fonctionnent
    total_contribution: contribution
  };
  
  // Si le chiffrement est activé, chiffrer les données sensibles
  if (encryptionEnabled) {
    try {
      const userKey = await getUserEncryptionKey(userId);
      const encryptedValue = encryptValue(contribution, userKey);
      
      console.log("Encryption enabled for add:", {
        originalValue: contribution,
        encryptedValue: encryptedValue
      });
      
      contributorData.total_contribution_encrypted = encryptedValue;
      contributorData.is_encrypted = true;
    } catch (error) {
      console.error("Erreur lors du chiffrement:", error);
      throw new Error("Impossible de chiffrer les données");
    }
  }

  console.log("Ajout d'un nouveau contributeur:", {
    encryptionEnabled: encryptionEnabled,
    contributorData: contributorData
  });

  const { data: insertedContributor, error: insertError } = await supabase
    .from("contributors")
    .insert([contributorData])
    .select()
    .single();

  if (insertError) throw insertError;
  if (!insertedContributor) throw new Error("Erreur lors de l'ajout du contributeur");

  return await fetchContributorsService();
};
