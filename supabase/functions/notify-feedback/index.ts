
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { Resend } from "npm:resend@2.0.0";

// Récupération de la clé API Resend depuis les variables d'environnement
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const resend = new Resend(RESEND_API_KEY);

// Log détaillé pour déboguer la clé API et l'environnement
console.log("🔑 RESEND_API_KEY disponible:", !!RESEND_API_KEY);
console.log("📝 Version de la fonction: 3.0");
console.log("⏱️ Démarrage de la fonction à:", new Date().toISOString());

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
  console.log("🚀 Edge function notify-feedback appelée", new Date().toISOString());
  console.log("📨 Méthode de la requête:", req.method);
  console.log("📋 URL de la requête:", req.url);

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log("🔄 Gestion de la requête CORS preflight");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!RESEND_API_KEY) {
      console.error("❌ Erreur critique: Clé API Resend manquante");
      return new Response(
        JSON.stringify({ error: "Configuration Resend manquante" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    console.log("📥 Lecture du payload...");
    let payload: WebhookPayload;
    
    try {
      payload = await req.json();
      console.log("📦 Payload reçu:", JSON.stringify(payload, null, 2));
    } catch (error) {
      console.error("❌ Erreur lors de la lecture du payload JSON:", error);
      return new Response(
        JSON.stringify({ error: "Payload JSON invalide" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Vérification que c'est bien un INSERT sur la table feedbacks
    if (payload.type !== 'INSERT' || payload.table !== 'feedbacks') {
      console.log("⚠️ Pas un nouveau feedback ou mauvaise table:", payload.type, payload.table);
      return new Response(
        JSON.stringify({ message: 'Pas un nouveau feedback' }), 
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // Récupération des variables d'environnement Supabase
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    console.log("🔐 Variables d'environnement Supabase disponibles:", !!SUPABASE_URL, !!SUPABASE_SERVICE_ROLE_KEY);

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error("❌ Variables d'environnement Supabase manquantes");
      throw new Error('Variables d\'environnement Supabase manquantes');
    }

    console.log("🔌 Création du client Supabase avec URL:", SUPABASE_URL);
    const supabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Récupération des informations du profil
    console.log("🔍 Récupération du profil pour ID:", payload.record.profile_id);
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('full_name, email')
      .eq('id', payload.record.profile_id)
      .single();

    if (profileError) {
      console.error("❌ Erreur lors de la récupération du profil:", profileError);
      throw profileError;
    }

    const userName = profile?.full_name || 'Utilisateur';
    const userEmail = profile?.email || 'Adresse email non disponible';
    console.log("👤 Infos utilisateur:", { userName, userEmail });

    // Préparation de l'envoi d'email direct
    console.log("📧 Préparation de l'envoi d'email à admin@budgetwizard.fr");
    
    // Création d'un lien vers la page de feedback dans l'application
    let feedbackUrl = "";
    if (SUPABASE_URL) {
      feedbackUrl = `${SUPABASE_URL.replace('.supabase.co', '.app')}/admin/feedbacks?id=${payload.record.id}`;
      console.log("🔗 URL du feedback:", feedbackUrl);
    }
    
    // Test d'envoi d'email avec une configuration simplifiée
    try {
      console.log("📨 Tentative d'envoi d'email via Resend...");
      const directEmailResult = await resend.emails.send({
        from: "Budget Wizard <no-reply@budgetwizard.fr>",
        to: ["admin@budgetwizard.fr"],
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
      
      console.log("✅ Résultat d'envoi d'email:", JSON.stringify(directEmailResult, null, 2));
      
      return new Response(JSON.stringify({ 
        success: true, 
        message: "Email envoyé avec succès à admin@budgetwizard.fr",
        result: directEmailResult 
      }), { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    } catch (emailError: any) {
      console.error("❌ Erreur lors de l'envoi d'email via Resend:", emailError);
      console.error("Stack trace:", emailError.stack);
      console.error("Détails de l'erreur:", JSON.stringify(emailError, null, 2));
      
      return new Response(JSON.stringify({ 
        error: "Erreur lors de l'envoi d'email", 
        details: emailError.message,
        stack: emailError.stack,
        errorObject: JSON.stringify(emailError)
      }), { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      });
    }

  } catch (error: any) {
    console.error('❌ Erreur lors du traitement du webhook:', error);
    console.error('Stack trace:', error.stack);
    
    return new Response(JSON.stringify({ 
      error: error.message,
      stack: error.stack 
    }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
      status: 500 
    });
  }
});
