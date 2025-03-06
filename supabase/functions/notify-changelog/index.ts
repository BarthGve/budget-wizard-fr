
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { supabaseClient } from "../_shared/supabase-client.ts";

// Configuration pour CORS
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ChangelogEntry {
  id: string;
  title: string;
  version: string;
  description: string;
  type: "new" | "improvement" | "bugfix";
  date: string;
}

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const handler = async (req: Request): Promise<Response> => {
  // Gérer les requêtes CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Cette fonction peut être appelée soit automatiquement par un trigger,
    // soit manuellement avec une entrée spécifique à notifier
    const { changelogEntryId } = await req.json();
    
    console.log(`Démarrage de la notification pour l'entrée ${changelogEntryId}`);
    
    // Initialiser le client Supabase avec la clé de service pour accéder à tous les utilisateurs
    const supabase = supabaseClient();
    
    // 1. Récupérer les détails de l'entrée de changelog
    const { data: changelogEntry, error: changelogError } = await supabase
      .from("changelog_entries")
      .select("*")
      .eq("id", changelogEntryId)
      .single();
    
    if (changelogError || !changelogEntry) {
      console.error("Erreur lors de la récupération de l'entrée changelog:", changelogError);
      return new Response(
        JSON.stringify({ 
          error: "Entrée changelog non trouvée",
          details: changelogError 
        }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
    // 2. Récupérer tous les utilisateurs non-admin qui n'ont pas désactivé les notifications
    const { data: usersToNotify, error: usersError } = await supabase
      .from("profiles")
      .select("id, full_name, email")
      .eq("notif_changelog", true)
      .not("id", "in", (
        // Sous-requête pour exclure les administrateurs
        supabase
          .from("user_roles")
          .select("user_id")
          .eq("role", "admin")
      ));
    
    if (usersError) {
      console.error("Erreur lors de la récupération des utilisateurs:", usersError);
      return new Response(
        JSON.stringify({ 
          error: "Erreur lors de la récupération des utilisateurs",
          details: usersError 
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
    console.log(`${usersToNotify?.length || 0} utilisateurs à notifier`);
    
    if (!usersToNotify || usersToNotify.length === 0) {
      return new Response(
        JSON.stringify({ message: "Aucun utilisateur à notifier" }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
    // 3. Envoyer un email à chaque utilisateur
    const emailPromises = usersToNotify.map(async (user) => {
      try {
        if (!user.email) {
          console.warn(`Utilisateur ${user.id} n'a pas d'email`);
          return null;
        }
        
        // Générer un token de désinscription unique
        const unsubscribeToken = crypto.randomUUID();
        
        // Enregistrer le token de désinscription dans la base de données
        await supabase
          .from("unsubscribe_tokens")
          .insert({
            profile_id: user.id,
            token: unsubscribeToken,
            notification_type: "changelog",
            expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 an d'expiration
          });
        
        // URL de désinscription avec token
        const unsubscribeUrl = `${Deno.env.get("PUBLIC_SITE_URL")}/unsubscribe?token=${unsubscribeToken}&type=changelog`;
        
        // Construire l'email avec le contenu du changelog
        const emailResponse = await resend.emails.send({
          from: "BudgetWizard <notifications@budgetwizard.fr>",
          to: [user.email],
          subject: `🚀 BudgetWizard évolue : découvrez les dernières nouveautés !`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <p>Bonjour ${user.full_name || ""}👋,</p>
              
              <p>Nous avons ajouté de nouvelles fonctionnalités sur <strong>BudgetWizard</strong> ! 🎉</p>
              
              <div style="margin: 20px 0; padding: 15px; border-left: 4px solid #4f46e5; background-color: #f9fafb;">
                <h2 style="margin-top: 0; color: #4f46e5;">📢 ${changelogEntry.title}</h2>
                <p style="white-space: pre-line;">${changelogEntry.description}</p>
                <p><strong>Version:</strong> ${changelogEntry.version}</p>
                <p><strong>Type:</strong> ${
                  changelogEntry.type === "new" ? "🆕 Nouvelle fonctionnalité" :
                  changelogEntry.type === "improvement" ? "⬆️ Amélioration" : 
                  "🐛 Correction de bug"
                }</p>
              </div>
              
              <p>🔎 <a href="${Deno.env.get("PUBLIC_SITE_URL")}/changelog" style="color: #4f46e5; text-decoration: underline;">Découvrez toutes les nouveautés ici</a></p>
              
              <p>À très bientôt sur BudgetWizard ! 🚀</p>
              <p>— L'équipe BudgetWizard</p>
              
              <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;" />
              
              <p style="font-size: 12px; color: #6b7280;">
                Vous recevez cet email car vous êtes inscrit aux notifications de BudgetWizard.
                <br>
                <a href="${unsubscribeUrl}" style="color: #6b7280;">Se désinscrire des notifications de mises à jour</a>
              </p>
            </div>
          `,
        });
        
        console.log(`Email envoyé à ${user.email}: ${JSON.stringify(emailResponse)}`);
        return emailResponse;
      } catch (emailError) {
        console.error(`Erreur lors de l'envoi de l'email à ${user.email}:`, emailError);
        return null;
      }
    });
    
    // Attendre que tous les emails soient envoyés, mais ne pas bloquer la réponse
    EdgeRuntime.waitUntil(Promise.all(emailPromises));
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Notification démarrée pour ${usersToNotify.length} utilisateurs` 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
    
  } catch (error) {
    console.error("Erreur dans la fonction notify-changelog:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);
