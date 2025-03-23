
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook qui récupère le profil utilisateur courant
 */
export const useProfileFetcher = () => {
  return useQuery({
    queryKey: ["current-profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return null;
      }

      return data;
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
};
