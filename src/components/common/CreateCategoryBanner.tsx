
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
    <Alert className="relative w-full bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-200 dark:border-indigo-800 py-3">
      <Button
        variant="ghost"
        className="absolute right-2 top-2 h-8 w-8 rounded-full p-0 hover:bg-indigo-500/20"
        onClick={handleDismiss}
      >
        <X className="h-4 w-4" />
      </Button>
      <AlertTitle className="text-lg font-semibold text-indigo-700 dark:text-indigo-300">
        Mettez de l'ordre dans vos dépenses ! 🏷️
      </AlertTitle>
      <AlertDescription className="mt-1 text-muted-foreground mb-2">
        Un budget bien organisé, c'est un budget maîtrisé ! Ajoutez votre première catégorie maintenant.
      </AlertDescription>
      <div className="flex justify-end mt-2">
        <Button
          onClick={() => navigate("/user-settings")}
          className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white"
          size="sm"
        >
          🔥 Je me lance !
        </Button>
      </div>
    </Alert>
  );
};
