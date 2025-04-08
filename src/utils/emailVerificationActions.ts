
import { NavigateFunction } from "react-router-dom";
import { toast } from "sonner";

/**
 * Gère le processus post-vérification email
 */
export const handlePostEmailVerification = (navigate: NavigateFunction) => {
  const justVerified = localStorage.getItem("justVerified") === "true";
  
  if (justVerified) {
    console.log("Email vérifié, nettoyage du flag");
    // Nettoyer le flag pour éviter les traitements multiples
    localStorage.removeItem("justVerified");
    
    // Si l'utilisateur est sur la page login et a vérifié son email,
    // afficher un message de succès
    if (window.location.pathname === "/login") {
      console.log("Notification de vérification d'email réussie");
      toast.success("Email vérifié avec succès, vous pouvez maintenant vous connecter");
    }
  }
};
