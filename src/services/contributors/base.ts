
import { supabase } from "@/integrations/supabase/client";

/**
 * Vérifie si l'utilisateur est authentifié et renvoie son ID
 * @returns L'ID de l'utilisateur authentifié
 * @throws Error si l'utilisateur n'est pas authentifié
 */
export const getAuthenticatedUserId = async (): Promise<string> => {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!user) throw new Error("Non authentifié");
  return user.id;
};
