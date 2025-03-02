
import { supabase } from "@/integrations/supabase/client";
import { Contributor } from "@/types/contributor";
import { getAuthenticatedUserId } from "./base";

export const fetchContributorsService = async (): Promise<Contributor[]> => {
  const userId = await getAuthenticatedUserId();

  const { data, error } = await supabase
    .from("contributors")
    .select("*")
    .eq("profile_id", userId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data || [];
};
