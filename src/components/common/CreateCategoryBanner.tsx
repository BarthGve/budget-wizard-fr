import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
      const { data: retailers, error } = await supabase
        .from("retailers")
        .select("id")
        .limit(1);

      if (error) {
        console.error("Error checking retailers:", error);
        return true;
      }

      return retailers && retailers.length > 0;
    },
  });

  // Fonction pour gérer la dismissal de la bannière
  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem("retailerBannerDismissed", "true");
  };

  if (isLoading || isDismissed || hasRetailers) {
    return null;
  }

  return (
    <Alert className="relative w-full bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-teal-500/10 border border-blue-200 dark:border-blue-800 py-3">
      <Button
        variant="ghost"
        className="absolute right-2 top-2 h-8 w-8 rounded-full p-0 hover:bg-blue-500/20"
        onClick={handleDismiss}
      >
        <X className="h-4 w-4" />
      </Button>
      <AlertTitle className="text-lg font-semibold text-blue-700 dark:text-blue-300">
        Identifiez vos enseignes préférées ! 🏪
      </AlertTitle>
      <AlertDescription className="mt-1 text-muted-foreground mb-2">
        Facilitez le suivi de vos achats en ajoutant les enseignes où vous faites régulièrement vos courses.
      </AlertDescription>
      <div className="flex justify-end mt-2">
        <Button
          onClick={() => navigate("/retailers")}
          className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
        >
          ⚡ Ajouter une enseigne
        </Button>
      </div>
    </Alert>
  );
};
