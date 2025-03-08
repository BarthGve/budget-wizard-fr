
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContributionDetails {
  contributionId: string;
}

serve(async (req) => {
  // Gérer les requêtes CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { contributionId }: ContributionDetails = await req.json();
    
    console.log(`📝 Traitement de la notification pour la contribution: ${contributionId}`);
    
    // Récupérer les détails de la contribution depuis la base de données
    const { data: supabaseClient } = await req.json();
    const { data: contribution, error: contributionError } = await supabaseClient
      .from("contributions")
      .select(`
        *,
        profile:profiles(full_name, email)
      `)
      .eq("id", contributionId)
      .single();

    if (contributionError) {
      console.error("❌ Erreur lors de la récupération de la contribution:", contributionError);
      throw contributionError;
    }

    // Créer le contenu HTML de l'email
    const emailHTML = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            h1 { color: #3b82f6; }
            .content { background-color: #f9fafb; padding: 20px; border-radius: 8px; }
            .footer { margin-top: 30px; font-size: 12px; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Nouvelle contribution reçue</h1>
            <div class="content">
              <p><strong>Utilisateur:</strong> ${contribution.profile.full_name || 'Utilisateur'}</p>
              <p><strong>Type:</strong> ${contribution.type}</p>
              <p><strong>Titre:</strong> ${contribution.title}</p>
              <p><strong>Contenu:</strong></p>
              <p>${contribution.content.replace(/\n/g, '<br>')}</p>
            </div>
            <div class="footer">
              <p>© BudgetWizard - Cette notification est automatique, merci de ne pas y répondre.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Envoyer l'email
    const emailResponse = await resend.emails.send({
      from: "BudgetWizard <notifications@budgetwizard.fr>",
      to: ["support@budgetwizard.fr"],
      subject: `Nouvelle contribution: ${contribution.title}`,
      html: emailHTML,
    });
    
    console.log("✅ Email envoyé avec succès:", emailResponse);
    
    return new Response(
      JSON.stringify({ success: true, message: "Notification envoyée" }),
      { 
        status: 200, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi de la notification:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );
  }
});
