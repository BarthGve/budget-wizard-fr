
import { toast } from "sonner";

/**
 * Utilitaire pour traiter les actions d'authentification dans l'URL
 */
export const processAuthAction = () => {
  try {
    // Récupérer le hash et les paramètres de l'URL
    const hash = window.location.hash;
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get("type") || "";
    
    console.log("processAuthAction - Analyse de l'URL", { hash, type, pathname: window.location.pathname });
    
    // Si nous avons un hash ou un type, traiter l'action
    if (hash || type) {
      // Nettoyer l'URL après traitement pour éviter les répétitions
      if (window.history && window.history.replaceState) {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
      
      // Analyser le hash pour les tokens de type email_change
      if (hash) {
        // Extraire le type depuis le hash (format #type=email_change&...)
        const hashParams = new URLSearchParams(hash.substring(1));
        const hashType = hashParams.get("type");
        
        // Si le hash contient un token de changement d'email, le traiter immédiatement
        if (hashType === "email_change" || hash.includes("type=email_change")) {
          console.log("Token de changement d'email détecté dans l'URL");
          
          // Informer l'utilisateur et configurer pour notification après mise à jour
          localStorage.setItem("email_change_pending", "true");
          setTimeout(() => {
            toast.success("Votre adresse email a été mise à jour avec succès");
          }, 1000);
        }
      }
      
      // Gérer les paramètres d'URL spécifiques
      if (type === "emailChange" || type === "recovery") {
        console.log("Paramètre de type détecté dans l'URL:", type);
        
        // Afficher toast si nécessaire
        if (type === "emailChange" && localStorage.getItem("email_change_pending") === "true") {
          setTimeout(() => {
            toast.success("Votre adresse email a été mise à jour avec succès");
            localStorage.removeItem("email_change_pending");
          }, 1000);
        }
      }
    }
  } catch (error) {
    console.error("Erreur lors du traitement des actions d'authentification URL:", error);
  }
};
