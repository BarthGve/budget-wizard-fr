
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Gérer les requêtes OPTIONS pour CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Récupérer les variables d'environnement
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");

    if (!supabaseUrl || !supabaseKey || !supabaseAnonKey) {
      throw new Error("Variables d'environnement manquantes");
    }

    // Créer le client Supabase
    const supabase = createClient(supabaseUrl, supabaseKey);

    // URL de la fonction Edge à appeler le 1er de chaque mois
    const functionUrl = `${supabaseUrl}/functions/v1/notify-expenses-monthly`;

    // Créer le cron job pour le 1er jour de chaque mois à 9h00
    const { data, error } = await supabase.rpc("pg_cron_schedule", {
      job_name: "monthly_expenses_notification",
      schedule: "0 9 1 * *", // À 9h00 le 1er de chaque mois
      command: `SELECT net.http_post(
        '${functionUrl}',
        '{}',
        'application/json',
        ARRAY[
          net.http_header('Authorization', 'Bearer ${supabaseAnonKey}'),
          net.http_header('Content-Type', 'application/json')
        ]
      )`
    });

    if (error) {
      console.error("Erreur lors de la création du cron job:", error);
      throw error;
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Cron job pour les notifications mensuelles de dépenses créé avec succès",
        data
      }),
      { 
        status: 200, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );
  } catch (error) {
    console.error("Erreur lors de la création du cron job:", error);
    
    return new Response(
      JSON.stringify({ 
        error: "Erreur lors de la création du cron job",
        details: error.message
      }),
      { 
        status: 500, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );
  }
});
