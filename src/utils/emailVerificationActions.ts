
import { NavigateFunction } from "react-router-dom";

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
