
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
 * Inscrit un nouvel utilisateur avec l'approche la plus simple possible
 */
export const registerUser = async (credentials: RegisterCredentials) => {
  console.log("Tentative d'inscription avec:", { email: credentials.email });
  
  try {
    // Approche simplifiée au maximum, sans options supplémentaires
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
    
    try {
      // Vérifier si un profil existe déjà pour cet utilisateur
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', data.user.id)
        .single();
      
      // Si aucun profil n'existe, en créer un manuellement
      if (!existingProfile) {
        console.log("Création manuelle du profil pour:", data.user.id);
        
        await supabase
          .from('profiles')
          .insert([{ 
            id: data.user.id, 
            full_name: credentials.name, 
            profile_type: 'basic' 
          }]);
          
        // Créer également un contributeur par défaut
        await supabase
          .from('contributors')
          .insert([{
            profile_id: data.user.id,
            name: credentials.name,
            is_owner: true,
            total_contribution: 0,
            percentage_contribution: 0
          }]);
          
        console.log("Profil et contributeur créés manuellement avec succès");
      }
    } catch (profileError) {
      // Logger l'erreur mais ne pas interrompre l'inscription
      console.warn("Erreur lors de la création du profil:", profileError);
    }
    
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
