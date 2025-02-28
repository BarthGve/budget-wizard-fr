
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export const CreateRetailerBanner = () => {
  const [isDismissed, setIsDismissed] = useState(false);
  const navigate = useNavigate();

  // Charger l'état de dismissal depuis localStorage au montage du composant
  useEffect(() => {
    const bannerDismissed = localStorage.getItem("retailerBannerDismissed");
    if (bannerDismissed === "true") {
      setIsDismissed(true);
    }
  }, []);

  const { data: hasRetailers, isLoading } = useQuery({
    queryKey: ["has-retailers"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return true; // Si pas d'utilisateur, ne pas afficher la bannière
      
      const { data: retailers, error } = await supabase
        .from("retailers")
        .select("id")
        .eq("profile_id", user.id)
        .limit(1);

      if (error) {
        console.error("Erreur lors de la vérification des enseignes :", error);
        return true; // En cas d'erreur, on n'affiche pas la bannière
      }

      return retailers && retailers.length > 0;
    },
  });

  // Fonction pour gérer la dismissal de la bannière
  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem("retailerBannerDismissed", "true");
  };

  // Ne rien afficher pendant le chargement ou si la bannière a été fermée
  if (isLoading || isDismissed || hasRetailers) {
    return null;
  }

  return (
    <Alert className="relative w-full h-full bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-200 dark:border-indigo-800">
    <Button
      variant="ghost"
      className="absolute right-2 top-2 h-8 w-8 rounded-full p-0 hover:bg-indigo-500/20"
      onClick={handleDismiss}
    >
      <X className="h-4 w-4" />
    </Button>
    <AlertTitle className="text-lg font-semibold text-indigo-700 dark:text-indigo-300">
      Commencez par créer une catégorie
    </AlertTitle>
    <AlertDescription className="mt-2 text-muted-foreground">
      Pour mieux organiser vos dépenses récurrentes, créez votre première catégorie dans les paramètres.
    </AlertDescription>
    <div className="flex justify-end mt-4">
      <Button
        onClick={() => navigate("/user-settings")}
        className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white"
      >
        Créer une catégorie
      </Button>
    </div>
  </Alert>










  );
};
