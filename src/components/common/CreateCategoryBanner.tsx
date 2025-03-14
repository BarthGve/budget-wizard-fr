import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const CreateCategoryBanner = () => {
  const [isDismissed, setIsDismissed] = useState(false);
  const navigate = useNavigate();

  // Charger l'état de dismissal depuis localStorage au montage du composant
  useEffect(() => {
    const bannerDismissed = localStorage.getItem("categoryBannerDismissed");
    if (bannerDismissed === "true") {
      setIsDismissed(true);
    }
  }, []);

  const { data: hasCategories, isLoading } = useQuery({
    queryKey: ["has-categories"],
    queryFn: async () => {
      const { data: categories, error } = await supabase
        .from("recurring_expense_categories")
        .select("id")
        .limit(1);

      if (error) {
        console.error("Error checking categories:", error);
        return true;
      }

      return categories && categories.length > 0;
    },
  });

  // Fonction pour gérer la dismissal de la bannière
  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem("categoryBannerDismissed", "true");
  };

  if (isLoading || isDismissed || hasCategories) {
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
        Mettez de l'ordre dans vos dépenses ! 🏷️
      </AlertTitle>
      <AlertDescription className="mt-0.5 text-sm text-indigo-600/70 dark:text-indigo-400/70 mb-1.5">
        Un budget bien organisé, c'est un budget maîtrisé ! Ajoutez votre première catégorie maintenant.
      </AlertDescription>
      <div className="flex justify-end mt-1">
        <Button
          onClick={() => navigate("/user-settings?tab=settings")}
          size="sm"
          className="bg-indigo-500/80 hover:bg-indigo-600/90 text-white text-sm px-3 py-1 h-auto"
        >
          🔥 Je me lance !
        </Button>
      </div>
    </Alert>
  );
};
