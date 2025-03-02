
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useLatestVersion() {
  const { data: latestVersion, isLoading } = useQuery({
    queryKey: ["latest-changelog-version"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("changelog_entries")
        .select("version")
        .order("date", { ascending: false })
        .limit(1)
        .single();
      
      if (error) {
        console.error("Error fetching latest version:", error);
        return null;
      }
      
      return data?.version || null;
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  return { latestVersion, isLoading };
}
