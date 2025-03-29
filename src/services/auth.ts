
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { recalculatePercentages } from "./contributors";

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
 * Envoie une notification à l'administrateur concernant le nouvel utilisateur
 */
const notifyAdmin = async (name: string, email: string) => {
  try {
    const signupDate = new Date().toLocaleString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const { error } = await supabase.functions.invoke("notify-new-user", {
      body: {
        userName: name,
        userEmail: email,
        signupDate
      }
    });

    if (error) {
      console.error("Erreur lors de la notification admin:", error);
    }
  } catch (error) {
    // On ne fait que logger l'erreur pour ne pas impacter l'expérience utilisateur
    console.error("Échec de l'envoi de notification admin:", error);
  }
};

/**
 * Inscrit un nouvel utilisateur avec une méthode directe et fiable
 * qui évite complètement les déclencheurs (triggers)
 */
export const registerUser = async (credentials: RegisterCredentials) => {
  console.log("Inscription utilisateur:", { email: credentials.email });
  
  try {
    // Étape 1: Créer l'utilisateur dans auth.users
    const { data, error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        data: { 
          name: credentials.name,
        }
      }
    });

    if (error) {
      console.error("Erreur lors de la création de l'utilisateur:", error);
      if (error.message.includes("User already registered")) {
        throw new Error("Un compte existe déjà avec cet email");
      } else {
        throw error;
      }
    }
    
    if (!data || !data.user) {
      throw new Error("Réponse inattendue du serveur. Veuillez réessayer.");
    }
    
    // Étape 2: Vérifier si le profil existe déjà
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', data.user.id)
      .single();
      
    // Étape 3: Créer le profil si nécessaire
    if (!existingProfile) {
      console.log("Création du profil utilisateur");
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{ 
          id: data.user.id, 
          full_name: credentials.name, 
          profile_type: 'basic' 
        }]);
        
      if (profileError) {
        console.error("Erreur lors de la création du profil:", profileError);
      }
    }
    
    // Étape 4: Vérifier si le contributeur existe déjà
    const { data: existingContributor } = await supabase
      .from('contributors')
      .select('id')
      .eq('profile_id', data.user.id)
      .eq('is_owner', true)
      .single();
      
    // Étape 5: Créer le contributeur si nécessaire
    if (!existingContributor) {
      console.log("Création du contributeur");
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
      }
      
      // Recalculer les pourcentages manuellement
      await recalculatePercentages(data.user.id);
    }
    
    // Stocker l'email pour la vérification
    localStorage.setItem("verificationEmail", credentials.email);
    
    console.log("Inscription réussie:", data.user.id);
    
    // Envoyer une notification à l'administrateur (en arrière-plan)
    // Cette opération ne bloque pas le processus d'inscription
    notifyAdmin(credentials.name, credentials.email);
    
    return data;
  } catch (error: any) {
    console.error("Erreur finale lors de l'inscription:", error);
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
