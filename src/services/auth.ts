
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
 * Inscrit un nouvel utilisateur avec une approche simplifiée
 */
export const registerUser = async (credentials: RegisterCredentials) => {
  console.log("Tentative d'inscription avec:", { email: credentials.email });
  
  try {
    // Inscription de base avec le minimum d'options
    const { data, error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        data: { 
          name: credentials.name 
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
    
    // Stocker l'email pour la vérification
    localStorage.setItem("verificationEmail", credentials.email);
    
    // Création manuelle du profil et du contributeur si les triggers ne fonctionnent pas
    try {
      const userId = data.user.id;
      
      // Vérifier si un profil existe déjà
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .single();
      
      // Si aucun profil n'existe, en créer un manuellement
      if (!existingProfile) {
        await supabase
          .from('profiles')
          .insert([{ 
            id: userId, 
            full_name: credentials.name, 
            profile_type: 'basic' 
          }]);
          
        // Créer également un contributeur par défaut
        await supabase
          .from('contributors')
          .insert([{
            profile_id: userId,
            name: credentials.name,
            is_owner: true,
            total_contribution: 0,
            percentage_contribution: 0
          }]);
      }
    } catch (backupError) {
      console.warn("Note: Création manuelle du profil tentée mais non nécessaire:", backupError);
      // Ne pas interrompre l'inscription si cette étape échoue
    }
    
    return data;
  } catch (error: any) {
    console.error("Exception lors de l'inscription:", error);
    
    // Gestion précise des erreurs connues
    if (error.message.includes("Database error") || 
        error.message.includes("stack depth") ||
        error.message.includes("column \"tg_depth\" does not exist")) {
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
