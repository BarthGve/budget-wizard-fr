
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { recalculatePercentages } from "./contributors";
import { validateAndSanitizeInput, validateEmail } from "@/utils/security";

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

// Utilisation d'un Set pour stocker les emails en cours d'inscription
// afin d'éviter les appels multiples pour le même email
const registrationsInProgress = new Set<string>();

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
  } finally {
    // Nettoyer le registre des inscriptions en cours
    registrationsInProgress.delete(email);
  }
};

/**
 * Inscrit un nouvel utilisateur avec une méthode directe et fiable
 * qui évite complètement les déclencheurs (triggers)
 */
export const registerUser = async (credentials: RegisterCredentials) => {
  console.log("Inscription utilisateur:", { email: credentials.email });
  
  // Validation et sanitisation des entrées
  if (!validateEmail(credentials.email)) {
    throw new Error("Format d'email invalide");
  }
  
  const sanitizedName = validateAndSanitizeInput(credentials.name, 50);
  const cleanEmail = credentials.email.toLowerCase().trim();
  
  if (!sanitizedName) {
    throw new Error("Le nom contient des caractères non autorisés");
  }
  
  // Vérifier si une inscription est déjà en cours pour cet email
  if (registrationsInProgress.has(cleanEmail)) {
    console.warn("Inscription déjà en cours pour:", cleanEmail);
    throw new Error("Une inscription est déjà en cours pour cet email");
  }
  
  // Marquer cet email comme étant en cours d'inscription
  registrationsInProgress.add(cleanEmail);
  
  try {
    // Étape 1: Créer l'utilisateur dans auth.users
    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password: credentials.password,
      options: {
        data: { 
          name: sanitizedName,
        }
      }
    });

    if (error) {
      console.error("Erreur lors de la création de l'utilisateur:", error);
      registrationsInProgress.delete(cleanEmail); // Nettoyer en cas d'erreur
      
      if (error.message.includes("User already registered")) {
        throw new Error("Un compte existe déjà avec cet email");
      } else {
        throw error;
      }
    }
    
    if (!data || !data.user) {
      registrationsInProgress.delete(cleanEmail); // Nettoyer en cas d'erreur
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
          full_name: sanitizedName, 
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
          name: sanitizedName,
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
    localStorage.setItem("verificationEmail", cleanEmail);
    
    console.log("Inscription réussie:", data.user.id);
    
    // Envoyer une notification à l'administrateur (en arrière-plan)
    // Cette opération ne bloque pas le processus d'inscription
    notifyAdmin(sanitizedName, cleanEmail);
    
    return data;
  } catch (error: any) {
    console.error("Erreur finale lors de l'inscription:", error);
    // Nettoyer en cas d'erreur
    registrationsInProgress.delete(cleanEmail);
    throw error;
  }
};

/**
 * Connecte un utilisateur
 */
export const loginUser = async (credentials: LoginCredentials) => {
  console.log("Tentative de connexion avec:", { email: credentials.email });
  
  // Validation et nettoyage des entrées
  if (!validateEmail(credentials.email)) {
    throw new Error("Format d'email invalide");
  }
  
  const cleanEmail = credentials.email.toLowerCase().trim();
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email: cleanEmail,
    password: credentials.password,
  });

  console.log("Réponse de connexion:", { data, error: error ? error.message : null });

  if (error) {
    console.error("Erreur détaillée:", error);
    
    // Messages d'erreur génériques pour éviter l'énumération d'utilisateurs
    throw new Error("Email ou mot de passe incorrect");
  }
  
  if (!data || !data.user) {
    throw new Error("Réponse inattendue du serveur. Veuillez réessayer.");
  }
  
  toast.success("Connexion réussie!");
  
  // Retourner directement l'objet data qui contient user et session
  return data;
};
