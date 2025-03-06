
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { supabaseClient } from "../_shared/supabase-client.ts";

// Cette fonction sera appelée automatiquement par un webhook de Supabase 
// quand une nouvelle entrée est ajoutée dans la table changelog_entries
const handler = async (req: Request): Promise<Response> => {
  try {
    // Récupérer les données de la requête
    const payload = await req.json();
    
    // Vérifier si c'est une insertion (new record)
    if (payload.type !== 'INSERT') {
      return new Response(JSON.stringify({ message: "Pas une nouvelle entrée, ignoré" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
    
    console.log("Nouvelle entrée changelog détectée:", payload.record.id);
    
    // Appeler la fonction Edge qui enverra les emails
    const notifyEndpoint = `${Deno.env.get("SUPABASE_URL")}/functions/v1/notify-changelog`;
    const response = await fetch(notifyEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get("SUPABASE_ANON_KEY")}`
      },
      body: JSON.stringify({
        changelogEntryId: payload.record.id
      })
    });
    
    const result = await response.json();
    console.log("Résultat de l'appel à notify-changelog:", result);
    
    return new Response(
      JSON.stringify({ success: true, message: "Notification déclenchée" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error("Erreur dans le déclencheur de notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
