
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { ZeroIncomeDialog } from "./ZeroIncomeDialog";

/**
 * Composant qui écoute les changements d'état d'authentification
 * et met à jour le cache React Query en conséquence de manière optimisée
 */
export const AuthListener = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const isInitialMount = useRef(true);
  const previousAuthState = useRef<boolean | null>(null);
  const navigationInProgress = useRef(false);
  const [showIncomeDialog, setShowIncomeDialog] = useState(false);
  const hasCheckedIncome = useRef(false);

  // Vérifier si le contributeur principal a un revenu nul
  const checkOwnerContributorIncome = async () => {
    if (hasCheckedIncome.current) return;
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

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

  useEffect(() => {
    // Configuration de l'écouteur d'événements pour les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Skip initial session check to avoid double navigation
        if (isInitialMount.current && event === "INITIAL_SESSION") {
          isInitialMount.current = false;
          
          // Store initial auth state
          previousAuthState.current = !!session;
          
          // Vérifier les revenus après la connexion initiale
          if (session) {
            checkOwnerContributorIncome();
          }
          
          return;
        }

        // Important: Avoid unnecessary cache invalidations if auth state didn't actually change
        const currentAuthState = !!session;
        if (previousAuthState.current === currentAuthState && event !== "SIGNED_OUT") {
          return;
        }
        
        previousAuthState.current = currentAuthState;

        if (event === "SIGNED_IN") {
          // Invalidation simple des caches pertinents
          queryClient.invalidateQueries({ queryKey: ["auth"] });
          queryClient.invalidateQueries({ queryKey: ["current-user"] });
          queryClient.invalidateQueries({ queryKey: ["profile"] });
          
          // Réinitialiser le flag pour vérifier les revenus lors de la connexion
          hasCheckedIncome.current = false;
          
          // Vérifier les revenus après connexion
          setTimeout(() => {
            checkOwnerContributorIncome();
          }, 1000); // Délai pour laisser le temps de charger les données
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
  }, [queryClient, navigate]);

  return (
    <ZeroIncomeDialog 
      open={showIncomeDialog} 
      onOpenChange={setShowIncomeDialog} 
    />
  );
};
