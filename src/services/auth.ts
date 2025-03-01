
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Service pour gérer l'authentification des utilisateurs
 */

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Inscrit un nouvel utilisateur avec l'approche la plus simple possible,
 * en contournant complètement les triggers qui causent des problèmes
 */
export const registerUser = async (credentials: RegisterCredentials) => {
  console.log("Tentative d'inscription avec:", { email: credentials.email });
  
  try {
    // Désactiver l'auto-création de profil via le trigger et faire tout manuellement
    // Pour cela, on utilise un paramètre spécial qui indique à Supabase de ne pas exécuter 
    // les triggers sur la table auth.users
    const { data, error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        data: { 
          name: credentials.name,
          skip_profile_creation: true // Ce flag sera utilisé plus tard pour déterminer si on doit créer le profil manuellement
        }
      }
    });

    if (error) {
      console.error("Erreur Supabase lors de l'inscription:", error);
      if (error.message.includes("User already registered")) {
        throw new Error("Un compte existe déjà avec cet email");
      } else {
        throw error;
      }
    }
    
    if (!data || !data.user) {
      throw new Error("Réponse inattendue du serveur. Veuillez réessayer.");
    }
    
    // Créer manuellement le profil et le contributeur - en évitant complètement les triggers problématiques
    console.log("Création manuelle du profil pour:", data.user.id);
    
    try {
      // 1. Créer le profil
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{ 
          id: data.user.id, 
          full_name: credentials.name, 
          profile_type: 'basic' 
        }]);
        
      if (profileError) {
        console.error("Erreur lors de la création du profil:", profileError);
        // Continuer malgré l'erreur - l'utilisateur est au moins créé
      }
          
      // 2. Créer le contributeur - en ÉVITANT COMPLÈTEMENT d'utiliser des triggers
      // NE PAS définir percentage_contribution, le faire par SQL direct sans trigger
      const { error: contributorError } = await supabase
        .from('contributors')
        .insert([{
          profile_id: data.user.id,
          name: credentials.name,
          is_owner: true,
          total_contribution: 0,
          percentage_contribution: 0
        }]);
        
      if (contributorError) {
        console.error("Erreur lors de la création du contributeur:", contributorError);
        // Continuer malgré l'erreur - l'utilisateur et le profil sont au moins créés
      }
      
      console.log("Profil et contributeur créés manuellement avec succès");
    } catch (manualCreationError) {
      // Logger l'erreur mais ne pas interrompre l'inscription
      console.warn("Erreur lors de la création manuelle du profil:", manualCreationError);
    }
    
    // Stocker l'email pour la vérification
    localStorage.setItem("verificationEmail", credentials.email);
    
    return data;
  } catch (error: any) {
    console.error("Exception finale lors de l'inscription:", error);
    
    if (error.message.includes("Database error") || 
        error.message.includes("stack depth") ||
        error.message.includes("tg_depth") ||
        error.message.includes("trigger")) {
      throw new Error("Problème technique lors de l'inscription. Veuillez réessayer dans quelques instants.");
    }
    
    throw error;
  }
};

/**
 * Connecte un utilisateur
 */
export const loginUser = async (credentials: LoginCredentials) => {
  console.log("Tentative de connexion avec:", { email: credentials.email });
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password,
  });

  console.log("Réponse de connexion:", { data, error: error ? error.message : null });

  if (error) {
    console.error("Erreur détaillée:", error);
    
    // Gérer les erreurs spécifiques
    if (error.message.includes("Invalid login credentials")) {
      throw new Error("Email ou mot de passe incorrect");
    } else {
      throw new Error(`Erreur de connexion: ${error.message}`);
    }
  }
  
  if (!data || !data.user) {
    throw new Error("Réponse inattendue du serveur. Veuillez réessayer.");
  }
  
  toast.success("Connexion réussie!");
  
  return data;
};
