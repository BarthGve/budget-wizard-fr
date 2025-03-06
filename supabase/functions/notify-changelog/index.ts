
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

// Interface pour la structure de données du changelog
interface ChangelogEntry {
  id: string;
  title: string;
  description: string;
  version: string;
  date: string;
  type: "new" | "improvement" | "bugfix" | string;
}

/**
 * Gère les requêtes OPTIONS (CORS pre-flight)
 */
function handleCorsRequest() {
  console.log("📝 Réponse aux options CORS pre-flight");
  return new Response(null, { headers: corsHeaders });
}

/**
 * Vérifie si la configuration d'email est correcte
 */
function checkEmailConfig() {
  if (!resendApiKey || !resend) {
    console.error("❌ RESEND_API_KEY non configurée");
    return {
      isValid: false,
      response: new Response(
        JSON.stringify({ 
          error: "Configuration d'email manquante. Veuillez configurer RESEND_API_KEY." 
        }),
        { 
          status: 500, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      )
    };
  }
  return { isValid: true };
}

/**
 * Parse le corps de la requête en JSON
 */
async function parseRequestBody(req: Request) {
  try {
    const requestBody = await req.json();
    console.log("📝 Corps de la requête:", JSON.stringify(requestBody));
    return { success: true, data: requestBody };
  } catch (jsonError) {
    console.error("❌ Erreur lors du parsing JSON:", jsonError);
    return { 
      success: false, 
      error: jsonError,
      response: new Response(
        JSON.stringify({ 
          error: "Corps de requête JSON invalide",
          details: jsonError.message
        }),
        { 
          status: 400, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      )
    };
  }
}

/**
 * Vérifie si l'ID du changelog est valide
 */
function validateChangelogId(id: string | undefined) {
  if (!id) {
    console.error("❌ ID d'entrée changelog manquant");
    return {
      isValid: false,
      response: new Response(
        JSON.stringify({ error: "ID d'entrée changelog requis" }),
        { 
          status: 400, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      )
    };
  }
  return { isValid: true };
}

/**
 * Récupère les détails de l'entrée changelog depuis Supabase
 */
async function fetchChangelogDetails(id: string) {
  console.log(`📝 Récupération des détails pour l'entrée changelog ${id}`);
  const { data, error } = await supabase
    .from("changelog_entries")
    .select("*")
    .eq("id", id)
    .single();
  
  if (error || !data) {
    console.error("❌ Erreur récupération changelog:", error);
    return {
      success: false,
      error,
      response: new Response(
        JSON.stringify({ 
          error: "Erreur lors de la récupération de l'entrée changelog",
          details: error 
        }),
        { 
          status: 404, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      )
    };
  }
  
  console.log("📝 Entrée changelog trouvée:", JSON.stringify(data));
  return { success: true, data: data as ChangelogEntry };
}

/**
 * Récupère les emails des utilisateurs non-admin qui ont activé les notifications
 */
async function fetchUserEmails() {
  console.log("📝 Récupération des emails des utilisateurs non-admin");
  const { data, error } = await supabase
    .rpc("get_non_admin_user_emails");
  
  if (error) {
    console.error("❌ Erreur récupération emails:", error);
    return {
      success: false,
      error,
      response: new Response(
        JSON.stringify({ 
          error: "Erreur lors de la récupération des emails",
          details: error 
        }),
        { 
          status: 500, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      )
    };
  }
  
  const userEmails = data.map(item => item.email);
  console.log(`📝 ${userEmails.length} emails d'utilisateurs récupérés:`, userEmails);
  
  if (userEmails.length === 0) {
    console.log("⚠️ Aucun email d'utilisateur trouvé pour l'envoi");
    return {
      success: false,
      noUsers: true,
      response: new Response(
        JSON.stringify({ message: "Aucun utilisateur à notifier" }),
        { 
          status: 200, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      )
    };
  }
  
  return { success: true, emails: userEmails };
}

/**
 * Crée le badge HTML en fonction du type de mise à jour
 */
function getTypeBadge(type: string) {
  let badgeText, badgeColor;
  switch (type) {
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
  
  return { badgeText, badgeColor };
}

/**
 * Crée le contenu HTML de l'email
 */
function createEmailContent(entry: ChangelogEntry) {
  const { badgeText, badgeColor } = getTypeBadge(entry.type);
  
  return `
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
          <h1>${entry.title}</h1>
          <div class="version">Version ${entry.version} - ${new Date(entry.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })}</div>
          <p>${entry.description.replace(/\n/g, '<br>')}</p>
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
}

/**
 * Envoie l'email de notification aux utilisateurs
 */
async function sendNotificationEmail(userEmails: string[], entry: ChangelogEntry) {
  try {
    console.log(`📝 Envoi d'emails à ${userEmails.length} destinataires: ${userEmails.join(', ')}`);
    
    const htmlContent = createEmailContent(entry);
    
    const emailResponse = await resend!.emails.send({
      from: "BudgetWizard <notifications@budgetwizard.fr>",
      to: userEmails,
      subject: `🚀 BudgetWizard évolue : découvrez les dernières nouveautés !`,
      html: htmlContent,
    });
    
    console.log("✅ Emails envoyés avec succès:", emailResponse);
    
    return {
      success: true,
      response: new Response(
        JSON.stringify({ 
          success: true, 
          message: `Notification envoyée à ${userEmails.length} utilisateurs`,
          emailResponse 
        }),
        { 
          status: 200, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      )
    };
  } catch (emailError) {
    console.error("❌ Erreur lors de l'envoi d'emails:", emailError);
    console.error("Détails de l'erreur:", emailError.stack);
    
    return {
      success: false,
      error: emailError,
      response: new Response(
        JSON.stringify({ 
          error: "Erreur lors de l'envoi des emails",
          details: emailError.message,
          stack: emailError.stack
        }),
        { 
          status: 500, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      )
    };
  }
}

/**
 * Fonction principale pour gérer les notifications de changelog
 */
async function handleChangelogNotification(req: Request) {
  // Vérification de la configuration d'email
  const emailConfigCheck = checkEmailConfig();
  if (!emailConfigCheck.isValid) {
    return emailConfigCheck.response;
  }
  
  // Récupération du corps de la requête
  const { success: bodySuccess, data: requestBody, error: bodyError, response: bodyErrorResponse } = await parseRequestBody(req);
  if (!bodySuccess) {
    return bodyErrorResponse;
  }
  
  // Récupération de l'ID de l'entrée changelog et du flag manuel
  const { id, manual = false } = requestBody;
  console.log(`📝 Traitement de la notification pour l'entrée changelog: ${id}, manuel: ${manual}`);
  
  // Validation de l'ID
  const idValidation = validateChangelogId(id);
  if (!idValidation.isValid) {
    return idValidation.response;
  }
  
  // Récupération des détails de l'entrée changelog
  const { success: changelogSuccess, data: changelogEntry, error: changelogError, response: changelogErrorResponse } = await fetchChangelogDetails(id);
  if (!changelogSuccess) {
    return changelogErrorResponse;
  }
  
  // Récupération des emails des utilisateurs
  const { success: emailsSuccess, emails: userEmails, noUsers, error: emailsError, response: emailsErrorResponse } = await fetchUserEmails();
  if (!emailsSuccess) {
    return emailsErrorResponse;
  }
  
  // Envoi des emails de notification
  const { success: sendSuccess, error: sendError, response: sendResponse } = await sendNotificationEmail(userEmails, changelogEntry);
  if (!sendSuccess) {
    return sendResponse;
  }
  
  return sendResponse;
}

/**
 * Fonction principale qui traite les requêtes entrantes
 */
serve(async (req: Request) => {
  console.log("📝 Edge Function notify-changelog: Demande reçue");
  console.log("📝 Méthode de la requête:", req.method);
  
  // Gestion des requêtes OPTIONS (CORS pre-flight)
  if (req.method === "OPTIONS") {
    return handleCorsRequest();
  }
  
  try {
    return await handleChangelogNotification(req);
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
