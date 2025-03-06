
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.1";
import { Resend } from "npm:resend@2.0.0";

// Configuration CORS
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Création d'un client Supabase
const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

// Création d'un client Resend pour l'envoi d'emails
const resendApiKey = Deno.env.get("RESEND_API_KEY");
const resend = resendApiKey ? new Resend(resendApiKey) : null;

serve(async (req: Request) => {
  console.log("📝 Edge Function notify-changelog: Demande reçue");
  console.log("📝 Méthode de la requête:", req.method);
  
  // Gestion des requêtes OPTIONS (CORS pre-flight)
  if (req.method === "OPTIONS") {
    console.log("📝 Réponse aux options CORS pre-flight");
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Vérification de la clé Resend
    if (!resendApiKey || !resend) {
      console.error("❌ RESEND_API_KEY non configurée");
      return new Response(
        JSON.stringify({ 
          error: "Configuration d'email manquante. Veuillez configurer RESEND_API_KEY." 
        }),
        { 
          status: 500, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );
    }
    
    // Récupération du corps de la requête
    let requestBody;
    try {
      requestBody = await req.json();
      console.log("📝 Corps de la requête:", JSON.stringify(requestBody));
    } catch (jsonError) {
      console.error("❌ Erreur lors du parsing JSON:", jsonError);
      return new Response(
        JSON.stringify({ 
          error: "Corps de requête JSON invalide",
          details: jsonError.message
        }),
        { 
          status: 400, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );
    }
    
    // Récupération de l'ID de l'entrée changelog et du flag manuel
    const { id, manual = false } = requestBody;
    console.log(`📝 Traitement de la notification pour l'entrée changelog: ${id}, manuel: ${manual}`);
    
    if (!id) {
      console.error("❌ ID d'entrée changelog manquant");
      return new Response(
        JSON.stringify({ error: "ID d'entrée changelog requis" }),
        { 
          status: 400, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );
    }
    
    // Récupération des détails de l'entrée changelog
    console.log(`📝 Récupération des détails pour l'entrée changelog ${id}`);
    const { data: changelogEntry, error: changelogError } = await supabase
      .from("changelog_entries")
      .select("*")
      .eq("id", id)
      .single();
    
    if (changelogError || !changelogEntry) {
      console.error("❌ Erreur récupération changelog:", changelogError);
      return new Response(
        JSON.stringify({ 
          error: "Erreur lors de la récupération de l'entrée changelog",
          details: changelogError 
        }),
        { 
          status: 404, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );
    }
    
    console.log("📝 Entrée changelog trouvée:", JSON.stringify(changelogEntry));
    
    // Récupération des emails des utilisateurs non-admin qui ont activé les notifications
    console.log("📝 Récupération des emails des utilisateurs non-admin");
    const { data: emailsData, error: emailsError } = await supabase
      .rpc("get_non_admin_user_emails");
    
    if (emailsError) {
      console.error("❌ Erreur récupération emails:", emailsError);
      return new Response(
        JSON.stringify({ 
          error: "Erreur lors de la récupération des emails",
          details: emailsError 
        }),
        { 
          status: 500, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );
    }
    
    const userEmails = emailsData.map(item => item.email);
    console.log(`📝 ${userEmails.length} emails d'utilisateurs récupérés:`, userEmails);
    
    if (userEmails.length === 0) {
      console.log("⚠️ Aucun email d'utilisateur trouvé pour l'envoi");
      return new Response(
        JSON.stringify({ message: "Aucun utilisateur à notifier" }),
        { 
          status: 200, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );
    }
    
    // Construction et envoi de l'email
    console.log("📝 Préparation de l'email de notification");
    
    // Adapter le texte en fonction du type de mise à jour
    let badgeText, badgeColor;
    switch (changelogEntry.type) {
      case "new":
        badgeText = "Nouvelle fonctionnalité";
        badgeColor = "#10b981"; // vert
        break;
      case "improvement":
        badgeText = "Amélioration";
        badgeColor = "#3b82f6"; // bleu
        break;
      case "bugfix":
        badgeText = "Correction de bug";
        badgeColor = "#f97316"; // orange
        break;
      default:
        badgeText = "Mise à jour";
        badgeColor = "#6b7280"; // gris
    }
    
    // Construction du contenu HTML de l'email
    const htmlContent = `
      <html>
        <head>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              margin-bottom: 30px;
            }
            .badge {
              display: inline-block;
              background-color: ${badgeColor};
              color: white;
              padding: 5px 10px;
              border-radius: 4px;
              font-size: 14px;
              margin-bottom: 10px;
            }
            h1 {
              color: #111;
              font-size: 24px;
              margin-bottom: 5px;
            }
            .version {
              color: #6b7280;
              font-size: 16px;
              margin-bottom: 20px;
            }
            .content {
              background-color: #f9fafb;
              padding: 20px;
              border-radius: 8px;
              margin-bottom: 30px;
            }
            .cta-button {
              display: inline-block;
              background-color: #3b82f6;
              color: white;
              padding: 10px 20px;
              text-decoration: none;
              border-radius: 4px;
              font-weight: 500;
            }
            .footer {
              margin-top: 30px;
              font-size: 14px;
              color: #6b7280;
              border-top: 1px solid #e5e7eb;
              padding-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <p>Bonjour 👋,</p>
            <p>Nous avons ajouté de nouvelles fonctionnalités sur <strong>BudgetWizard</strong> ! 🎉</p>
          </div>
          
          <div class="content">
            <div class="badge">${badgeText}</div>
            <h1>${changelogEntry.title}</h1>
            <div class="version">Version ${changelogEntry.version} - ${new Date(changelogEntry.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })}</div>
            <p>${changelogEntry.description.replace(/\n/g, '<br>')}</p>
          </div>
          
          <p>
            <a href="https://budgetwizard.fr/changelog" class="cta-button">🔎 Découvrez toutes les nouveautés ici</a>
          </p>
          
          <div class="footer">
            <p>À très bientôt sur BudgetWizard ! 🚀</p>
            <p>— L'équipe BudgetWizard</p>
            <p style="font-size: 12px; margin-top: 20px;">Vous recevez cet email car vous êtes inscrit sur BudgetWizard. Pour ne plus recevoir ces notifications, vous pouvez les désactiver dans vos paramètres de profil.</p>
          </div>
        </body>
      </html>
    `;
    
    try {
      console.log(`📝 Envoi d'emails à ${userEmails.length} destinataires: ${userEmails.join(', ')}`);
      
      // Pour le développement, limiter à un seul email de test si nécessaire
      // const testEmails = ["test@example.com"];
      
      const emailResponse = await resend.emails.send({
        from: "BudgetWizard <notifications@budgetwizard.fr>",
        to: userEmails,
        subject: `🚀 BudgetWizard évolue : découvrez les dernières nouveautés !`,
        html: htmlContent,
      });
      
      console.log("✅ Emails envoyés avec succès:", emailResponse);
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: `Notification envoyée à ${userEmails.length} utilisateurs`,
          emailResponse 
        }),
        { 
          status: 200, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );
    } catch (emailError) {
      console.error("❌ Erreur lors de l'envoi d'emails:", emailError);
      console.error("Détails de l'erreur:", emailError.stack);
      
      return new Response(
        JSON.stringify({ 
          error: "Erreur lors de l'envoi des emails",
          details: emailError.message,
          stack: emailError.stack
        }),
        { 
          status: 500, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );
    }
    
  } catch (error) {
    console.error("❌ Erreur générale:", error);
    console.error("Détails de l'erreur:", error.stack);
    
    return new Response(
      JSON.stringify({ 
        error: "Erreur interne du serveur",
        details: error.message,
        stack: error.stack
      }),
      { 
        status: 500, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );
  }
});
