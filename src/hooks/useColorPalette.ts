
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useColorPalette = () => {
  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (error) throw error;

      return data;
    },
  });

  const colorPalette = profile?.color_palette || "default";
  const paletteToBackground: Record<string, string> = {
    default: "bg-blue-500 hover:bg-blue-600",
    ocean: "bg-sky-500 hover:bg-sky-600",
    forest: "bg-green-500 hover:bg-green-600",
    sunset: "bg-orange-500 hover:bg-orange-600",
    candy: "bg-pink-400 hover:bg-pink-500",
  };

  return {
    colorPalette,
    backgroundClass: paletteToBackground[colorPalette]
  };
};
