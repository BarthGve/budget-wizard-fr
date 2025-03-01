
import CryptoJS from 'crypto-js';
import { supabase } from '@/integrations/supabase/client';

/**
 * Génère une clé de chiffrement basée sur l'identifiant utilisateur
 */
export const getUserEncryptionKey = async (userId: string): Promise<string> => {
  // Créer une clé déterministe basée sur l'ID utilisateur
  // Dans une application réelle, vous devriez utiliser un sel stocké en sécurité
  return CryptoJS.SHA256(userId + "secure-salt").toString();
};

/**
 * Chiffre une valeur avec la clé utilisateur fournie
 */
export const encryptValue = (value: any, userKey: string): string => {
  const valueStr = typeof value === 'object' ? JSON.stringify(value) : String(value);
  return CryptoJS.AES.encrypt(valueStr, userKey).toString();
};

/**
 * Déchiffre une valeur avec la clé utilisateur fournie
 */
export const decryptValue = (encrypted: string, userKey: string, isNumber: boolean = false): string | number => {
  const bytes = CryptoJS.AES.decrypt(encrypted, userKey);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);
  
  if (isNumber) {
    return parseFloat(decrypted);
  }
  
  try {
    // Tenter de parser en tant que JSON si c'est un objet
    return JSON.parse(decrypted);
  } catch {
    // Sinon retourner la chaîne déchiffrée
    return decrypted;
  }
};

/**
 * Vérifie si le chiffrement est activé pour l'utilisateur actuel
 */
export const isEncryptionEnabled = async (): Promise<boolean> => {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    console.error("Erreur d'authentification lors de la vérification du chiffrement:", userError);
    return false;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("encryption_enabled")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    console.error("Erreur lors de la vérification du chiffrement:", error);
    return false;
  }

  return data?.encryption_enabled || false;
};

/**
 * Active ou désactive le chiffrement pour l'utilisateur actuel
 */
export const setEncryptionEnabled = async (enabled: boolean): Promise<boolean> => {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    console.error("Erreur d'authentification lors de l'activation du chiffrement:", userError);
    return false;
  }

  const { error } = await supabase
    .from("profiles")
    .update({ encryption_enabled: enabled })
    .eq("id", user.id);

  if (error) {
    console.error("Erreur lors de l'activation du chiffrement:", error);
    return false;
  }

  console.log(`Chiffrement ${enabled ? 'activé' : 'désactivé'} avec succès`);
  return true;
};
