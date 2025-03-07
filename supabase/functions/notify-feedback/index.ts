
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.48.1';

// Initialisation des clients
const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseKey);

// Configuration des en-têtes CORS
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": 
    "authorization, x-client-info, apikey, content-type",
};

// Interface pour les données du feedback
interface FeedbackNotificationRequest {
  feedbackId: string;
}

// Fonction pour attendre un court délai (en ms)
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const handler = async (req: Request): Promise<Response> => {
  console.log("Fonction notify-feedback appelée");
  
  // Gérer les requêtes CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Récupérer l'ID du feedback depuis la requête
    const { feedbackId }: FeedbackNotificationRequest = await req.json();
    console.log(`Notification pour le feedback ID: ${feedbackId}`);

    // Attendre un court délai pour s'assurer que le feedback est persisté
    await delay(500);

    // Récupérer les détails du feedback avec une gestion d'erreur améliorée
    // Correction : utilisation correcte des alias et des colonnes disponibles
    const { data: feedback, error: feedbackError } = await supabase
      .from("feedbacks")
      .select(`
        *,
        profile:profiles(full_name)
      `)
      .eq("id", feedbackId)
      .single();

    if (feedbackError) {
      console.error("Erreur lors de la récupération du feedback:", feedbackError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: feedbackError.message, 
          details: `Impossible de trouver le feedback avec l'ID: ${feedbackId}` 
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    if (!feedback) {
      console.error(`Feedback non trouvé avec l'ID: ${feedbackId}`);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Feedback non trouvé", 
          feedbackId 
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log("Feedback récupéré avec succès:", feedback.id);

    // Récupérer les IDs des administrateurs
    console.log("Récupération des administrateurs...");
    const { data: adminIds, error: rpcError } = await supabase.rpc('list_admins');
    
    if (rpcError) {
      console.error("Erreur lors de la récupération des administrateurs:", rpcError);
      return new Response(
        JSON.stringify({ success: false, error: rpcError.message }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    if (!adminIds || adminIds.length === 0) {
      console.log("Aucun administrateur trouvé");
      return new Response(JSON.stringify({ success: false, reason: "no_admins" }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    }
    
    // Extraire les IDs des administrateurs
    const adminIdList = adminIds.map(item => item.id);
    console.log("IDs des administrateurs:", adminIdList);

    // Récupérer les emails des administrateurs avec leurs préférences de notification
    const { data: adminProfiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, email, notif_feedbacks')
      .in('id', adminIdList);

    if (profilesError) {
      console.error("Erreur lors de la récupération des profils admin:", profilesError);
      return new Response(
        JSON.stringify({ success: false, error: profilesError.message }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Filtrer les administrateurs qui ont activé les notifications de feedback
    const adminEmails = adminProfiles
      .filter(profile => profile.notif_feedbacks !== false)
      .filter(profile => profile.email) // S'assurer que l'email existe
      .map(profile => profile.email);

    console.log(`Emails des administrateurs à notifier (${adminEmails.length}):`, adminEmails);
    
    if (adminEmails.length === 0) {
      console.log("Aucun administrateur avec notifications activées");
      return new Response(JSON.stringify({ success: false, reason: "no_admins_with_notifications" }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    }
    
    // Formater la date de création
    const createdAt = new Date(feedback.created_at).toLocaleString('fr-FR', {
      dateStyle: 'full',
      timeStyle: 'short'
    });

    // Envoyer l'email aux administrateurs
    const emailResponse = await resend.emails.send({
      from: "BudgetWizard <notifications@budgetwizard.fr>",
      to: adminEmails,
      subject: `📝 Nouveau feedback de ${feedback.profile.full_name || 'un utilisateur'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #3f51b5;">Nouveau feedback reçu</h2>
          <p>Bonjour,</p>
          <p>Un nouveau feedback vient d'être soumis sur BudgetWizard.</p>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Utilisateur :</strong> ${feedback.profile.full_name || 'Anonyme'}</p>
            <p><strong>Titre :</strong> ${feedback.title}</p>
            <p><strong>Note :</strong> ${feedback.rating}/5</p>
            <p><strong>Message :</strong> ${feedback.content}</p>
            <p><strong>Date :</strong> ${createdAt}</p>
          </div>
          <p><a href="https://app.budgetwizard.fr/admin/feedbacks" style="background-color: #3f51b5; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px; display: inline-block;">✨ Consulter les feedbacks</a></p>
        </div>
      `,
    });

    console.log("Email envoyé avec succès:", emailResponse);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Erreur lors de l'envoi de l'email de notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
