
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

/**
 * Inscrit un nouvel utilisateur
 */
export const registerUser = async (credentials: RegisterCredentials) => {
  console.log("Tentative d'inscription avec:", { email: credentials.email, name: credentials.name });
  
  // Simplify the signup process to avoid trigger recursion
  // First create the user without metadata to avoid triggering complex chains
  const { data, error: signUpError } = await supabase.auth.signUp({
    email: credentials.email,
    password: credentials.password,
    options: {
      // Explicitly set empty data to minimize potential trigger issues
      data: { }
    }
  });

  console.log("Réponse d'inscription:", { data, error: signUpError ? signUpError.message : null });

  if (signUpError) {
    console.error("Erreur détaillée:", signUpError);
    
    // Handle specific errors
    if (signUpError.message.includes("User already registered")) {
      throw new Error("Un compte existe déjà avec cet email");
    } else if (signUpError.message.includes("Database error")) {
      console.error("Erreur supabase détectée:", signUpError);
      throw new Error("Erreur de connexion à la base de données. Veuillez contacter l'administrateur.");
    } else {
      throw new Error(`Erreur d'inscription: ${signUpError.message}`);
    }
  }
  
  if (!data || !data.user) {
    throw new Error("Réponse inattendue du serveur. Veuillez réessayer.");
  }
  
  // Store email to allow verification
  localStorage.setItem("verificationEmail", credentials.email);
  
  // Store name to update later
  localStorage.setItem("userName", credentials.name);
  
  toast.success("Inscription réussie! Veuillez vérifier votre email.");
  
  return data;
};
