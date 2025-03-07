
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Service pour gérer la réinitialisation du mot de passe
 */

/**
 * Envoie un email de réinitialisation de mot de passe
 * @param email - Adresse email de l'utilisateur
 */
export const sendPasswordResetEmail = async (email: string): Promise<boolean> => {
  try {
    console.log("📧 Demande de réinitialisation pour:", email);
    
    // Utiliser l'API Supabase pour demander une réinitialisation
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) throw error;
    
    console.log("✅ Demande de réinitialisation acceptée par Supabase");
    
    // Essayer d'envoyer un email personnalisé via notre fonction edge
    try {
      const resetToken = data?.token || "";
      
      if (resetToken) {
        console.log("🔑 Token récupéré, envoi de l'email personnalisé");
        
        const { error: sendError } = await supabase.functions.invoke("send-reset-password", {
          body: { email, token: resetToken }
        });
        
        if (sendError) {
          console.error("❌ Erreur envoi email personnalisé:", sendError);
          // On continue car Supabase a déjà accepté la demande
        } else {
          console.log("✉️ Email personnalisé envoyé avec succès");
        }
      }
    } catch (emailError) {
      console.error("❌ Erreur lors de l'envoi de l'email personnalisé:", emailError);
      // On continue même si l'email personnalisé échoue
    }
    
    return true;
  } catch (error: any) {
    console.error("❌ Erreur réinitialisation:", error);
    throw error;
  }
};

/**
 * Valide un token de réinitialisation
 * @param token - Token de réinitialisation
 */
export const validateResetToken = async (token: string): Promise<boolean> => {
  try {
    console.log("🔍 Validation du token de réinitialisation...");
    
    const { error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: 'recovery'
    });

    if (error) {
      console.error("❌ Token invalide:", error);
      return false;
    }

    console.log("✅ Token validé avec succès");
    return true;
  } catch (error) {
    console.error("❌ Erreur lors de la validation du token:", error);
    return false;
  }
};

/**
 * Met à jour le mot de passe de l'utilisateur
 * @param password - Nouveau mot de passe
 */
export const updatePassword = async (password: string): Promise<boolean> => {
  try {
    console.log("🔄 Mise à jour du mot de passe...");
    
    const { error } = await supabase.auth.updateUser({
      password: password
    });

    if (error) throw error;

    console.log("✅ Mot de passe mis à jour avec succès");
    return true;
  } catch (error: any) {
    console.error("❌ Erreur mise à jour mot de passe:", error);
    throw error;
  }
};
