
// Utilitaires pour la gestion CORS

// Headers CORS pour les requêtes
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/**
 * Gère les requêtes OPTIONS (CORS pre-flight)
 */
export function handleCorsRequest(): Response {
  console.log("📝 Réponse aux options CORS pre-flight");
  return new Response(null, { headers: corsHeaders });
}
