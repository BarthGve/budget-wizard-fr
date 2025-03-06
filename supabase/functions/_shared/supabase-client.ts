
import { createClient } from "npm:@supabase/supabase-js@2.36.0";

export function supabaseClient() {
  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
  
  return createClient(supabaseUrl, supabaseServiceKey);
}
