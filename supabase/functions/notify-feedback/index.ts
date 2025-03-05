
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { Resend } from "npm:resend@2.0.0";

// Récupération de la clé API Resend depuis les variables d'environnement
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const resend = new Resend(RESEND_API_KEY);

// Log pour déboguer la clé API
console.log("RESEND_API_KEY disponible:", !!RESEND_API_KEY);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WebhookPayload {
  type: 'INSERT' | 'UPDATE' | 'DELETE';
  table: string;
  record: {
    id: string;
    title: string;
    content: string;
    rating: number;
    profile_id: string;
    created_at: string;
  };
  schema: string;
  old_record: null | Record<string, any>;
}

serve(async (req: Request) => {
  console.log("Edge function notify-feedback called");

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log("Handling CORS preflight request");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload: WebhookPayload = await req.json();
    console.log("Received webhook payload:", JSON.stringify(payload, null, 2));

    if (payload.type !== 'INSERT' || payload.table !== 'feedbacks') {
      console.log("Not a new feedback or wrong table:", payload.type, payload.table);
      return new Response(JSON.stringify({ message: 'Not a new feedback' }), { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 200 
      });
    }

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error("Missing Supabase environment variables");
      throw new Error('Missing Supabase environment variables');
    }

    console.log("Creating Supabase client with URL:", SUPABASE_URL);
    const supabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Get the profile information
    console.log("Fetching profile for ID:", payload.record.profile_id);
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('full_name, email')
      .eq('id', payload.record.profile_id)
      .single();

    if (profileError) {
      console.error("Error fetching profile:", profileError);
      throw profileError;
    }

    const userName = profile?.full_name || 'Utilisateur';
    const userEmail = profile?.email || 'Adresse email non disponible';
    console.log("User info:", { userName, userEmail });

    // Test d'envoi d'email direct à admin@budgetwizard.fr
    console.log("Préparation de l'envoi d'email direct à admin@budgetwizard.fr");
    
    // Créer un lien vers la page de feedback dans l'application
    let feedbackUrl = "";
    if (SUPABASE_URL) {
      feedbackUrl = `${SUPABASE_URL.replace('https://', 'https://budgetwizard.app/')}/admin/feedbacks?id=${payload.record.id}`;
      console.log("Feedback URL:", feedbackUrl);
    }
    
    try {
      const directEmailResult = await resend.emails.send({
        from: "Budget Wizard <notification@budgetwizard.fr>",
        to: "admin@budgetwizard.fr",
        subject: `Nouveau feedback : ${payload.record.title}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333;">Nouveau feedback reçu</h1>
            <p style="color: #666;">Un nouveau feedback a été soumis par ${userName} (${userEmail}).</p>
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h2 style="color: #444; margin-top: 0;">${payload.record.title}</h2>
              <p style="color: #666;">${payload.record.content}</p>
              <p style="color: #888;">Note : ${payload.record.rating}/5</p>
            </div>
            <p style="color: #666;">Date de soumission : ${new Date(payload.record.created_at).toLocaleString('fr-FR')}</p>
            <div style="margin-top: 20px;">
              <a href="${feedbackUrl}" style="background-color: #4F46E5; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Voir le feedback dans l'application
              </a>
            </div>
          </div>
        `
      });
      
      console.log("Résultat d'envoi d'email direct:", JSON.stringify(directEmailResult, null, 2));
      
      return new Response(JSON.stringify({ 
        success: true, 
        message: "Email envoyé avec succès à admin@budgetwizard.fr",
        result: directEmailResult 
      }), { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    } catch (emailError) {
      console.error("Erreur lors de l'envoi d'email direct:", emailError);
      return new Response(JSON.stringify({ 
        error: "Erreur lors de l'envoi d'email", 
        details: emailError.message,
        stack: emailError.stack
      }), { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      });
    }

  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      stack: error.stack 
    }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
      status: 500 
    });
  }
});
