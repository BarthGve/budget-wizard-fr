
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { supabaseClient } from "../_shared/supabase-client.ts";

// Configuration pour CORS
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  // Gérer les requêtes CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { token, type } = await req.json();
    
    if (!token || !type) {
      return new Response(
        JSON.stringify({ error: "Token et type requis" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
    console.log(`Demande de désinscription avec token ${token} pour ${type}`);
    
    // Initialiser le client Supabase avec la clé de service
    const supabase = supabaseClient();
    
    // 1. Vérifier si le token est valide
    const { data: tokenData, error: tokenError } = await supabase
      .from("unsubscribe_tokens")
      .select("profile_id, expires_at")
      .eq("token", token)
      .eq("notification_type", type)
      .single();
    
    if (tokenError || !tokenData) {
      console.error("Erreur token:", tokenError);
      return new Response(
        JSON.stringify({ 
          error: "Token invalide ou expiré",
          details: tokenError 
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
    // Vérifier si le token a expiré
    if (new Date(tokenData.expires_at) < new Date()) {
      return new Response(
        JSON.stringify({ error: "Token expiré" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
    // 2. Mettre à jour les préférences de notification en fonction du type
    let updateResult;
    if (type === "changelog") {
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ notif_changelog: false })
        .eq("id", tokenData.profile_id);
      
      updateResult = { error: updateError };
    } else {
      return new Response(
        JSON.stringify({ error: "Type de notification non pris en charge" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
    if (updateResult.error) {
      console.error("Erreur lors de la mise à jour des préférences:", updateResult.error);
      return new Response(
        JSON.stringify({ 
          error: "Erreur lors de la mise à jour des préférences",
          details: updateResult.error 
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
    // 3. Invalider le token après utilisation
    await supabase
      .from("unsubscribe_tokens")
      .update({ status: "used" })
      .eq("token", token);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Désinscription réussie" 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
    
  } catch (error) {
    console.error("Erreur dans la fonction unsubscribe:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);
