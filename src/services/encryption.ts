
import CryptoJS from 'crypto-js';
import { supabase } from "@/integrations/supabase/client";

// Récupère la clé principale à partir de l'environnement local (pour le développement)
// En production, cette clé serait stockée dans les variables d'environnement de Supabase
const MASTER_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'default-dev-key-change-in-production';

/**
 * Génère une clé de chiffrement spécifique à l'utilisateur
 * @param userId ID de l'utilisateur
 * @returns Clé dérivée pour cet utilisateur
 */
export const getUserEncryptionKey = async (userId: string): Promise<string> => {
  try {
    // On génère une clé unique basée sur l'ID utilisateur et la clé principale
    // La clé utilisateur est dérivée pour ne pas avoir à la stocker
    const userKey = CryptoJS.PBKDF2(userId, MASTER_KEY, {
      keySize: 256 / 32,
      iterations: 1000
    }).toString();
    
    console.log(`Generated encryption key for user ${userId}`);
    return userKey;
  } catch (error) {
    console.error('Erreur lors de la génération de la clé utilisateur:', error);
    throw new Error('Impossible de générer la clé de chiffrement');
  }
};

/**
 * Chiffre une valeur numérique ou textuelle
 * @param value Valeur à chiffrer
 * @param userKey Clé de chiffrement spécifique à l'utilisateur
 * @returns Données chiffrées en Base64
 */
export const encryptValue = (value: string | number, userKey: string): string => {
  try {
    // Convertir les nombres en chaînes
    const stringValue = typeof value === 'number' ? value.toString() : value;
    
    // Chiffrer avec AES
    const encrypted = CryptoJS.AES.encrypt(stringValue, userKey).toString();
    
    console.log(`Value encrypted successfully: ${typeof value} -> ${encrypted.substring(0, 20)}...`);
    return encrypted;
  } catch (error) {
    console.error('Error during encryption:', error);
    throw error;
  }
};

/**
 * Déchiffre une valeur
 * @param encryptedValue Valeur chiffrée
 * @param userKey Clé de chiffrement spécifique à l'utilisateur
 * @param isNumber Indique si la valeur originale était un nombre
 * @returns Valeur déchiffrée (nombre ou chaîne)
 */
export const decryptValue = (encryptedValue: string, userKey: string, isNumber: boolean = false): string | number => {
  try {
    if (!encryptedValue) {
      console.warn('Attempted to decrypt empty value');
      return isNumber ? 0 : '';
    }
    
    // Déchiffrer
    const decrypted = CryptoJS.AES.decrypt(encryptedValue, userKey);
    const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
    
    if (!decryptedString) {
      console.error('Decryption resulted in empty string');
      return isNumber ? 0 : '';
    }
    
    console.log(`Value decrypted successfully: ${encryptedValue.substring(0, 20)}... -> ${decryptedString}`);
    
    // Convertir en nombre si nécessaire
    return isNumber ? parseFloat(decryptedString) : decryptedString;
  } catch (error) {
    console.error('Erreur lors du déchiffrement:', error);
    return isNumber ? 0 : '';
  }
};

/**
 * Vérifie si l'utilisateur a activé le chiffrement
 */
export const isEncryptionEnabled = async (): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    
    const { data } = await supabase
      .from('profiles')
      .select('encryption_enabled')
      .eq('id', user.id)
      .single();
    
    const enabled = data?.encryption_enabled || false;
    console.log(`Encryption status for user ${user.id}: ${enabled}`);
    return enabled;
  } catch (error) {
    console.error('Erreur lors de la vérification du statut de chiffrement:', error);
    return false;
  }
};
