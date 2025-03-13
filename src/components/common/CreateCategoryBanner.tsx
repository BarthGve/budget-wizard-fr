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
    <Alert className="relative w-full bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-200/60 dark:border-indigo-800/40 shadow-sm rounded-lg py-4 px-5">
      <Button
        variant="ghost"
        className="absolute right-3 top-3 h-8 w-8 rounded-full p-0 hover:bg-indigo-500/20 transition-colors duration-200"
        onClick={handleDismiss}
      >
        <X className="h-4 w-4" />
      </Button>
      <AlertTitle className="text-lg font-semibold text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
        <span className="bg-indigo-100 dark:bg-indigo-900/40 rounded-full p-1.5 flex items-center justify-center">
          🏷️
        </span>
        Mettez de l'ordre dans vos dépenses !
      </AlertTitle>
      <AlertDescription className="mt-2 text-muted-foreground mb-3 pl-10">
        Un budget bien organisé, c'est un budget maîtrisé ! Ajoutez votre première catégorie maintenant.
      </AlertDescription>
      <div className="flex justify-end mt-2">
        <Button
          onClick={() => navigate("/user-settings?tab=settings")}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium transition-all duration-200 shadow-sm hover:shadow px-4 py-2"
        >
          <span className="mr-2">🔥</span> Je me lance !
        </Button>
      </div>
    </Alert>
  );
};
