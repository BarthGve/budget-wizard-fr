
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

/**
 * Hook pour gérer les vérifications d'emails et les changements d'emails
 */
export const useEmailVerificationHandler = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    // Récupérer le hash de l'URL
    const hash = window.location.hash;
    
    console.log("Hash détecté dans l'URL:", hash);
    
    // Vérifier si le hash contient un token de type recovery ou email_change
    if (hash && (hash.includes("type=recovery") || hash.includes("type=email_change"))) {
      console.log("Token de vérification détecté dans l'URL:", hash);
      
      // Extraire le token et le type
      const hashParams = new URLSearchParams(hash.substring(1));
      const type = hashParams.get("type");
      
      if (type === "email_change") {
        // Traiter la confirmation de changement d'email
        supabase.auth.onAuthStateChange(async (event, session) => {
          if (event === "USER_UPDATED") {
            console.log("Événement USER_UPDATED détecté");
            
            // Invalider les requêtes pour forcer le rafraîchissement des données
            queryClient.invalidateQueries({ queryKey: ["auth"] });
            queryClient.invalidateQueries({ queryKey: ["current-user"] });
            queryClient.invalidateQueries({ queryKey: ["profile"] });
            
            // Informer l'utilisateur
            toast.success("Votre adresse email a été mise à jour avec succès");
            
            // Rediriger vers les paramètres utilisateur
            navigate("/user-settings");
          }
        });
      }
    }
  }, [navigate, queryClient]);

  // Gérer la redirection post-vérification email
  useEffect(() => {
    const justVerified = localStorage.getItem("justVerified") === "true";
    
    if (justVerified && window.location.pathname === "/login") {
      // Nettoyer le flag
      localStorage.removeItem("justVerified");
      
      // Si l'utilisateur vient de vérifier son email et est sur la page login,
      // on lui permet de se connecter normalement sans redirection automatique
      console.log("Email vérifié, login requis");
    }
  }, []);

  return {};
};
