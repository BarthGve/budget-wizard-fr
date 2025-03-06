
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.1";
import { Resend } from "npm:resend@2.0.0";

// Importation des utilitaires et services
import { corsHeaders, handleCorsRequest } from "./utils/cors.ts";
import { checkEmailConfig, parseRequestBody, validateChangelogId } from "./utils/validation.ts";
import { fetchChangelogDetails, setupChangelogNotificationListener } from "./services/changelog.ts";
import { fetchUserEmails } from "./services/user.ts";
import { sendNotificationEmail } from "./services/email.ts";
import { RequestPayload } from "./types.ts";

// Création d'un client Supabase
const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

// Création d'un client Resend pour l'envoi d'emails
const resendApiKey = Deno.env.get("RESEND_API_KEY");
const resend = resendApiKey ? new Resend(resendApiKey) : null;

/**
 * Fonction principale pour gérer les notifications de changelog
 */
async function handleChangelogNotification(req: Request) {
  // Vérification de la configuration d'email
  const emailConfigCheck = checkEmailConfig(resendApiKey, resend);
  if (!emailConfigCheck.isValid) {
    return emailConfigCheck.response;
  }
  
  // Récupération du corps de la requête
  const { success: bodySuccess, data: requestBody, error: bodyError, response: bodyErrorResponse } = await parseRequestBody(req);
  if (!bodySuccess) {
    return bodyErrorResponse;
  }
  
  // Récupération de l'ID de l'entrée changelog et du flag manuel
  const { id, manual = false } = requestBody as RequestPayload;
  console.log(`📝 Traitement de la notification pour l'entrée changelog: ${id}, manuel: ${manual}`);
  
  // Validation de l'ID
  const idValidation = validateChangelogId(id);
  if (!idValidation.isValid) {
    return idValidation.response;
  }
  
  // Récupération des détails de l'entrée changelog
  const { success: changelogSuccess, data: changelogEntry, error: changelogError, response: changelogErrorResponse } = await fetchChangelogDetails(supabase, id);
  if (!changelogSuccess) {
    return changelogErrorResponse;
  }
  
  // Récupération des emails des utilisateurs
  const { success: emailsSuccess, emails: userEmails, noUsers, error: emailsError, response: emailsErrorResponse } = await fetchUserEmails(supabase);
  if (!emailsSuccess) {
    return emailsErrorResponse;
  }
  
  // Envoi des emails de notification
  const { success: sendSuccess, error: sendError, response: sendResponse } = await sendNotificationEmail(resend!, userEmails, changelogEntry);
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
  console.log("📝 URL de la requête:", req.url);
  console.log("📝 Headers de la requête:", JSON.stringify(Object.fromEntries(req.headers.entries())));
  
  // Gestion des requêtes OPTIONS (CORS pre-flight)
  if (req.method === "OPTIONS") {
    return handleCorsRequest();
  }
  
  try {
    // Configurer l'écouteur de notifications
    await setupChangelogNotificationListener();
    
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
