
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
 * pour éviter les problèmes de triggers et récursion côté Supabase
 */
export const registerUser = async (credentials: RegisterCredentials) => {
  console.log("Tentative d'inscription simplifiée avec:", { email: credentials.email });
  
  try {
    // Méthode la plus directe possible sans options supplémentaires
    const { data, error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        // Minimum d'informations pour éviter des traitements complexes côté serveur
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
    
    // Créer manuellement le profil utilisateur si le trigger côté Supabase échoue
    try {
      if (data.user.id) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{ 
            id: data.user.id, 
            full_name: credentials.name, 
            profile_type: 'basic' 
          }])
          .select()
          .single();
          
        if (profileError) {
          console.warn("Erreur lors de la création manuelle du profil:", profileError);
          // Ne pas interrompre l'inscription, juste logger l'erreur
        }
      }
    } catch (profileError) {
      console.warn("Exception lors de la création manuelle du profil:", profileError);
      // Ne pas interrompre l'inscription, juste logger l'erreur
    }
    
    return data;
  } catch (error: any) {
    console.error("Exception lors de l'inscription:", error);
    
    // Gestion plus précise des erreurs
    if (
      error.message.includes("Database error") || 
      error.message.includes("stack depth") ||
      error.message.includes("column \"tg_depth\" does not exist")
    ) {
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
