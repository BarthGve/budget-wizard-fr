
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
 * Valide les données du formulaire d'inscription
 */
export const validateRegisterForm = (formData: RegisterFormData): ValidationResult => {
  if (!formData.name.trim()) {
    return {
      isValid: false,
      error: "Le nom est obligatoire"
    };
  }
  
  if (!formData.email.trim()) {
    return {
      isValid: false,
      error: "L'email est obligatoire"
    };
  }
  
  if (!formData.password) {
    return {
      isValid: false,
      error: "Le mot de passe est obligatoire"
    };
  }
  
  if (formData.password.length < 6) {
    return {
      isValid: false,
      error: "Le mot de passe doit contenir au moins 6 caractères"
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
