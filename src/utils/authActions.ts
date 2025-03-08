
import { NavigateFunction } from "react-router-dom";

/**
 * Utilitaire pour traiter les actions d'authentification dans l'URL
 */
export const processAuthAction = () => {
  // Récupérer le hash et les paramètres de l'URL
  const hash = window.location.hash;
  const urlParams = new URLSearchParams(window.location.search);
  const type = urlParams.get("type") || "";
  
  // Analyser le hash pour les tokens de type email_change
  if (hash) {
    console.log("Analyse du hash pour actions d'authentification:", hash);
    
    // Extraire le type depuis le hash (format #type=email_change&...)
    const hashParams = new URLSearchParams(hash.substring(1));
    const hashType = hashParams.get("type");
    
    // Si le hash contient un token de changement d'email, le traiter immédiatement
    if (hashType === "email_change" || hash.includes("type=email_change")) {
      console.log("Token de changement d'email détecté dans l'URL");
      
      // Laisser Supabase traiter le token sans intervention supplémentaire
      // La redirection et les notifications seront gérées lors de l'événement USER_UPDATED
    }
  }
  
  // Gérer la redirection après vérification d'email
  if (type === "emailChange" || type === "recovery") {
    console.log("Paramètre de type détecté dans l'URL:", type);
  }
};

/**
 * Gère le processus post-vérification email
 */
export const handlePostEmailVerification = (navigate: NavigateFunction) => {
  const justVerified = localStorage.getItem("justVerified") === "true";
  
  if (justVerified && window.location.pathname === "/login") {
    // Nettoyer le flag
    localStorage.removeItem("justVerified");
    
    // Si l'utilisateur vient de vérifier son email et est sur la page login,
    // on lui permet de se connecter normalement sans redirection automatique
    console.log("Email vérifié, login requis");
  }
};
