
/**
 * Utilitaires de sécurité pour la validation et la sanitisation
 */

// Import conditionnel de DOMPurify pour éviter les erreurs de build
let DOMPurify: any = null;
try {
  DOMPurify = require('dompurify');
} catch (error) {
  console.warn('DOMPurify non disponible, utilisation de la sanitisation manuelle');
}

// Configuration DOMPurify pour une sécurité maximale
const sanitizeConfig = {
  ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
  ALLOWED_ATTR: [],
  KEEP_CONTENT: true,
  ALLOW_DATA_ATTR: false,
};

/**
 * Sanitise le contenu HTML pour prévenir les attaques XSS
 */
export const sanitizeHtml = (dirty: string): string => {
  if (!dirty || typeof dirty !== 'string') {
    return '';
  }
  
  // Utiliser DOMPurify si disponible, sinon fallback sur sanitizeText
  if (DOMPurify && DOMPurify.sanitize) {
    return DOMPurify.sanitize(dirty, sanitizeConfig);
  }
  
  // Fallback: sanitisation manuelle
  return sanitizeText(dirty);
};

/**
 * Sanitise le texte brut en échappant les caractères dangereux
 */
export const sanitizeText = (text: string): string => {
  if (!text || typeof text !== 'string') {
    return '';
  }
  
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Valide et sanitise les entrées utilisateur
 */
export const validateAndSanitizeInput = (input: string, maxLength: number = 1000): string => {
  if (!input || typeof input !== 'string') {
    return '';
  }
  
  // Limite la longueur
  const truncated = input.substring(0, maxLength);
  
  // Sanitise le contenu
  return sanitizeText(truncated);
};

/**
 * Vérifie la force d'un mot de passe
 */
export const validatePasswordStrength = (password: string): {
  isValid: boolean;
  errors: string[];
  score: number;
} => {
  const errors: string[] = [];
  let score = 0;
  
  if (password.length < 8) {
    errors.push('Le mot de passe doit contenir au moins 8 caractères');
  } else {
    score += 1;
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une lettre minuscule');
  } else {
    score += 1;
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une lettre majuscule');
  } else {
    score += 1;
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins un chiffre');
  } else {
    score += 1;
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\?]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins un caractère spécial');
  } else {
    score += 1;
  }
  
  // Vérifier contre des mots de passe courants
  const commonPasswords = [
    'password', '123456', '123456789', 'qwerty', 'abc123', 
    'password123', 'admin', 'letmein', 'welcome', '123123'
  ];
  
  if (commonPasswords.includes(password.toLowerCase())) {
    errors.push('Ce mot de passe est trop commun');
    score = 0;
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    score: Math.min(score, 5)
  };
};

/**
 * Limite le taux de tentatives par IP/utilisateur
 */
class RateLimiter {
  private attempts: Map<string, { count: number; lastAttempt: number }> = new Map();
  private readonly maxAttempts: number;
  private readonly windowMs: number;

  constructor(maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const userAttempts = this.attempts.get(identifier);

    if (!userAttempts) {
      this.attempts.set(identifier, { count: 1, lastAttempt: now });
      return true;
    }

    // Réinitialiser si la fenêtre est expirée
    if (now - userAttempts.lastAttempt > this.windowMs) {
      this.attempts.set(identifier, { count: 1, lastAttempt: now });
      return true;
    }

    // Incrémenter le compteur
    userAttempts.count++;
    userAttempts.lastAttempt = now;

    return userAttempts.count <= this.maxAttempts;
  }

  getRemainingTime(identifier: string): number {
    const userAttempts = this.attempts.get(identifier);
    if (!userAttempts) return 0;
    
    const elapsed = Date.now() - userAttempts.lastAttempt;
    return Math.max(0, this.windowMs - elapsed);
  }
}

export const loginRateLimiter = new RateLimiter(5, 15 * 60 * 1000); // 5 tentatives par 15 minutes

/**
 * Valide un email de manière sécurisée
 */
export const validateEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') {
    return false;
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

/**
 * Génère un identifiant pour la limitation de taux basé sur l'IP (simulé)
 */
export const getRateLimitIdentifier = (): string => {
  // En production, utiliser l'IP réelle
  return 'user_' + (typeof window !== 'undefined' ? window.location.hostname : 'unknown');
};
