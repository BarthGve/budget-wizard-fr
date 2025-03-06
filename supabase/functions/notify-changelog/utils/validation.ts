
import { corsHeaders } from "./cors.ts";
import { Resend } from "npm:resend@2.0.0";

/**
 * Vérifie si la configuration d'email est correcte
 */
export function checkEmailConfig(resendApiKey: string | undefined, resend: Resend | null) {
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
export async function parseRequestBody(req: Request) {
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
export function validateChangelogId(id: string | undefined) {
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
