
import { validateAndSanitizeInput, validatePasswordStrength, validateEmail } from "./security";

/**
 * Utilitaire de validation pour les formulaires d'authentification
 */

export interface ValidationResult {
  isValid: boolean;
  error: string | null;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

/**
 * Valide les données du formulaire d'inscription avec sécurité renforcée
 */
export const validateRegisterForm = (formData: RegisterFormData): ValidationResult => {
  // Validation et sanitisation du nom
  const sanitizedName = validateAndSanitizeInput(formData.name.trim(), 50);
  if (!sanitizedName) {
    return {
      isValid: false,
      error: "Le nom est obligatoire et ne doit contenir que des caractères valides"
    };
  }
  
  // Validation de l'email
  if (!formData.email.trim()) {
    return {
      isValid: false,
      error: "L'email est obligatoire"
    };
  }
  
  if (!validateEmail(formData.email)) {
    return {
      isValid: false,
      error: "Format d'email invalide"
    };
  }
  
  // Validation du mot de passe
  if (!formData.password) {
    return {
      isValid: false,
      error: "Le mot de passe est obligatoire"
    };
  }
  
  const passwordValidation = validatePasswordStrength(formData.password);
  if (!passwordValidation.isValid) {
    return {
      isValid: false,
      error: passwordValidation.errors[0] // Afficher la première erreur
    };
  }
  
  if (formData.password !== formData.confirmPassword) {
    return {
      isValid: false,
      error: "Les mots de passe ne correspondent pas"
    };
  }
  
  return {
    isValid: true,
    error: null
  };
};

/**
 * Valide un champ de texte avec sanitisation
 */
export const validateTextInput = (value: string, fieldName: string, maxLength: number = 1000): ValidationResult => {
  if (!value || !value.trim()) {
    return {
      isValid: false,
      error: `Le champ ${fieldName} est obligatoire`
    };
  }
  
  const sanitized = validateAndSanitizeInput(value, maxLength);
  if (sanitized !== value.trim()) {
    return {
      isValid: false,
      error: `Le champ ${fieldName} contient des caractères non autorisés`
    };
  }
  
  return {
    isValid: true,
    error: null
  };
};
