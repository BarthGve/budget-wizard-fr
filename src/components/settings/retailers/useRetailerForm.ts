import { useState } from "react";
import { toast } from "@/hooks/useToastWrapper";
import { supabase } from "@/integrations/supabase/client";
import { Retailer, RetailerFormData } from "./types";
import { useQueryClient } from "@tanstack/react-query";

const getFaviconUrl = (domain: string) => {
  if (!domain) return null;
  const cleanDomain = domain.trim().toLowerCase();
  return `https://logo.clearbit.com/${cleanDomain}`;
};

interface UseRetailerFormProps {
  retailer?: Retailer;
  onSuccess: () => void;
}

export const useRetailerForm = ({ retailer, onSuccess }: UseRetailerFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const onSubmit = async (data: RetailerFormData) => {
    try {
      setIsLoading(true);
      const logo_url = getFaviconUrl(data.domain || "");

      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser();

      if (userError) throw userError;

      if (retailer) {
        const { error } = await supabase
          .from("retailers")
          .update({
            name: data.name,
            logo_url
          })
          .eq("id", retailer.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("retailers")
          .insert({
            name: data.name,
            logo_url,
            profile_id: user.id
          });

        if (error) throw error;
      }

      await queryClient.invalidateQueries({ queryKey: ["retailers"] });
      onSuccess();
    } catch (error) {
      console.error("Error saving retailer:", error);
      toast.error(
        retailer
          ? "Erreur lors de la mise à jour de l'enseigne"
          : "Erreur lors de l'ajout de l'enseigne"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    onSubmit,
    isLoading
  };
};
