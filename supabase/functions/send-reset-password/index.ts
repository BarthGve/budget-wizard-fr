
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

// Initialisation de Resend pour l'envoi d'emails
const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

// Initialisation du client Supabase
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseKey);

// Configuration CORS
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Gestion des requêtes OPTIONS pour CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Récupération des données de la requête
    const { email } = await req.json();

    if (!email) {
      throw new Error("Email requis");
    }

    console.log("Tentative d'envoi d'email de réinitialisation à:", email);

    // Génération d'un lien de réinitialisation via Supabase
    const { data, error } = await supabase.auth.admin.generateLink({
      type: "recovery",
      email: email,
      options: {
        redirectTo: `${Deno.env.get("SITE_URL")}/reset-password`,
      }
    });

    if (error) {
      console.error("Erreur lors de la génération du lien:", error);
      throw error;
    }

    const resetLink = data.properties.action_link;
    console.log("Lien de réinitialisation généré:", resetLink);

    // Envoi de l'email via Resend
    const emailResponse = await resend.emails.send({
      from: "Budget Wizard <noreply@budgetwizard.fr>",
      to: email,
      subject: "Réinitialisation de votre mot de passe",
      html: `
        <h1>Réinitialisation de mot de passe</h1>
        <p>Bonjour,</p>
        <p>Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte.</p>
        <p>Si vous êtes à l'origine de cette demande, veuillez cliquer sur le lien ci-dessous pour réinitialiser votre mot de passe :</p>
        <p><a href="${resetLink}" style="padding: 10px 15px; background-color: #8B5CF6; color: white; text-decoration: none; border-radius: 5px;">Réinitialiser mon mot de passe</a></p>
        <p>Ce lien expirera dans 24 heures.</p>
        <p>Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email.</p>
        <p>Cordialement,<br>L'équipe Budget Wizard</p>
      `,
    });

    console.log("Email envoyé avec succès:", emailResponse);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Erreur dans la fonction send-reset-password:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "Une erreur s'est produite lors de l'envoi de l'email" 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
