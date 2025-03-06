
import { corsHeaders } from "../utils/cors.ts";

/**
 * Récupère les emails des utilisateurs non-admin qui ont activé les notifications
 */
export async function fetchUserEmails(supabase: any) {
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
  
  const userEmails = data.map((item: { email: string }) => item.email);
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
