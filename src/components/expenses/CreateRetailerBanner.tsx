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
    <Alert className="relative w-full bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-200 dark:border-indigo-800 py-2.5 px-4">
      <Button
        variant="ghost"
        className="absolute right-1 top-1 h-7 w-7 rounded-full p-0 hover:bg-indigo-500/10"
        onClick={handleDismiss}
      >
        <X className="h-3.5 w-3.5" />
      </Button>
      <AlertTitle className="text-base font-medium text-indigo-700 dark:text-indigo-300">
        Suivez vos dépenses, magasin par magasin 🛍️
      </AlertTitle>
      <AlertDescription className="mt-0.5 text-sm text-indigo-600/70 dark:text-indigo-400/70 mb-1.5">
        Ajoutez vos enseignes favorites et suivez vos achats en toute simplicité!
      </AlertDescription>
      <div className="flex justify-end mt-1">
        <Button
          onClick={() => navigate("/user-settings?tab=settings")}
          size="sm"
          className="bg-indigo-500/80 hover:bg-indigo-600/90 text-white text-sm px-3 py-1 h-auto"
        >
          🚀 Let's go !
        </Button>
      </div>
    </Alert>
  );
};
