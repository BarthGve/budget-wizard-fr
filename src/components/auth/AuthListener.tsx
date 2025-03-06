import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router-dom";
import { ZeroIncomeDialog } from "./ZeroIncomeDialog";
import { toast } from "sonner";

/**
 * Composant qui écoute les changements d'état d'authentification
 * et met à jour le cache React Query en conséquence de manière optimisée
 */
export const AuthListener = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const isInitialMount = useRef(true);
  const previousAuthState = useRef<boolean | null>(null);
  const navigationInProgress = useRef(false);
  const [showIncomeDialog, setShowIncomeDialog] = useState(false);
  const hasCheckedIncome = useRef(false);

  // Vérifier si le contributeur principal a un revenu nul
  const checkOwnerContributorIncome = async () => {
    // Ne vérifier que si l'utilisateur est sur la page dashboard
    if (location.pathname !== "/dashboard" || hasCheckedIncome.current) return;
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Vérifier d'abord si l'utilisateur est admin
      const { data: isAdmin, error: adminError } = await supabase.rpc('has_role', {
        user_id: user.id,
        role: 'admin'
      });
      
      if (adminError) {
        console.error("Erreur lors de la vérification du rôle admin:", adminError);
      }
      
      // Ne pas afficher la modale pour les admins
      if (isAdmin) {
        hasCheckedIncome.current = true;
        return;
      }

      const { data: ownerContributor, error } = await supabase
        .from("contributors")
        .select("total_contribution")
        .eq("profile_id", user.id)
        .eq("is_owner", true)
        .single();

      if (error) {
        console.error("Erreur lors de la vérification des revenus:", error);
        return;
      }

      if (ownerContributor && ownerContributor.total_contribution === 0) {
        setShowIncomeDialog(true);
      }
      
      hasCheckedIncome.current = true;
    } catch (error) {
      console.error("Erreur lors de la vérification des revenus:", error);
    }
  };

  // Détecter et gérer les actions de vérification d'email
  useEffect(() => {
    // Récupérer le hash de l'URL
    const hash = window.location.hash;
    
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
    
    if (justVerified && location.pathname === "/login") {
      // Nettoyer le flag
      localStorage.removeItem("justVerified");
      
      // Si l'utilisateur vient de vérifier son email et est sur la page login,
      // on lui permet de se connecter normalement sans redirection automatique
      console.log("Email vérifié, login requis");
    }
  }, [location.pathname, navigate]);

  // Réinitialiser le flag de vérification des revenus lorsque la route change
  useEffect(() => {
    // Si l'utilisateur navigue vers le dashboard, on vérifie le revenu
    if (location.pathname === "/dashboard") {
      hasCheckedIncome.current = false;
      checkOwnerContributorIncome();
    } else {
      // Si l'utilisateur n'est pas sur le dashboard, on masque la modale
      setShowIncomeDialog(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    // Configuration de l'écouteur d'événements pour les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Événement d'authentification détecté:", event);
        
        // Skip initial session check to avoid double navigation
        if (isInitialMount.current && event === "INITIAL_SESSION") {
          isInitialMount.current = false;
          
          // Store initial auth state
          previousAuthState.current = !!session;
          
          // Vérifier les revenus après la connexion initiale uniquement si sur dashboard
          if (session && location.pathname === "/dashboard") {
            checkOwnerContributorIncome();
          }
          
          return;
        }

        // Important: Avoid unnecessary cache invalidations if auth state didn't actually change
        const currentAuthState = !!session;
        if (previousAuthState.current === currentAuthState && event !== "SIGNED_OUT" && event !== "USER_UPDATED") {
          return;
        }
        
        previousAuthState.current = currentAuthState;

        if (event === "SIGNED_IN") {
          // Vérifier si l'utilisateur vient de vérifier son email
          const justVerified = localStorage.getItem("justVerified") === "true";
          
          // Invalidation simple des caches pertinents
          queryClient.invalidateQueries({ queryKey: ["auth"] });
          queryClient.invalidateQueries({ queryKey: ["current-user"] });
          queryClient.invalidateQueries({ queryKey: ["profile"] });
          
          // Réinitialiser le flag pour vérifier les revenus lors de la connexion
          hasCheckedIncome.current = false;
          
          // Si l'utilisateur est déjà sur la page de login et vient juste de vérifier son email,
          // on le redirige vers le dashboard
          if (location.pathname === "/login" && justVerified) {
            localStorage.removeItem("justVerified");
            navigate("/dashboard");
          }
          
          // Vérifier les revenus après connexion uniquement si sur dashboard
          if (location.pathname === "/dashboard") {
            setTimeout(() => {
              checkOwnerContributorIncome();
            }, 1000); // Délai pour laisser le temps de charger les données
          }
        } else if (event === "USER_UPDATED") {
          // Gérer la mise à jour du profil utilisateur
          console.log("Profil utilisateur mis à jour");
          
          // Invalider les requêtes pour rafraîchir les données
          queryClient.invalidateQueries({ queryKey: ["auth"] });
          queryClient.invalidateQueries({ queryKey: ["current-user"] });
          queryClient.invalidateQueries({ queryKey: ["profile"] });
        } else if (event === "SIGNED_OUT") {
          try {
            // Éviter la navigation multiple
            if (navigationInProgress.current) return;
            navigationInProgress.current = true;
            
            // Invalidation simple des caches pertinents
            const keysToInvalidate = [
              "auth", 
              "current-user", 
              "profile", 
              "contributors", 
              "expenses", 
              "recurring-expenses",
              "recurring-expense-categories",
              "credits",
              "credits-monthly-stats",
              "savings"
            ];
            
            keysToInvalidate.forEach(key => {
              queryClient.invalidateQueries({ queryKey: [key] });
            });
            
            // Utiliser navigate avec replace pour éviter d'ajouter à l'historique
            navigate("/", { replace: true });
            
            // Réinitialiser le drapeau après un délai pour permettre la navigation complète
            setTimeout(() => {
              navigationInProgress.current = false;
            }, 200);
            
          } catch (error) {
            console.error("Error during sign out handling:", error);
            navigationInProgress.current = false;
          }
        }
      }
    );

    // Nettoyage à la désinstallation du composant
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [queryClient, navigate, location.pathname]);

  return (
    <ZeroIncomeDialog 
      open={showIncomeDialog} 
      onOpenChange={setShowIncomeDialog} 
    />
  );
};
