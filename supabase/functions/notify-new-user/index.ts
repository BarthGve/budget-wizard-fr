
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.48.1';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": 
    "authorization, x-client-info, apikey, content-type",
};

interface NewUserNotificationRequest {
  userName: string;
  userEmail: string;
  signupDate: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Gérer les requêtes CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Notification d'inscription reçue");
    
    const { userName, userEmail, signupDate }: NewUserNotificationRequest = await req.json();
    
    console.log(`Détails d'inscription: Nom: ${userName}, Email: ${userEmail}, Date: ${signupDate}`);

    // Vérifier si un admin a désactivé les notifications
    const { data: adminProfiles, error: adminError } = await supabase
      .from('profiles')
      .select('*')
      .in('id', (await supabase.rpc('list_admins')).data || []);

    if (adminError) {
      console.error("Erreur lors de la récupération des profils admin:", adminError);
      throw adminError;
    }

    console.log(`${adminProfiles?.length || 0} profils admin trouvés`);
    
    // Vérifier si au moins un admin souhaite recevoir les notifications
    const shouldSendNotification = adminProfiles?.some(profile => profile.notif_inscriptions !== false);
    
    if (!shouldSendNotification) {
      console.log("Les notifications d'inscription sont désactivées, aucun email ne sera envoyé");
      return new Response(JSON.stringify({ success: false, reason: "notifications_disabled" }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    }

    const adminEmail = "admin@budgetwizard.fr";
    
    const emailResponse = await resend.emails.send({
      from: "BudgetWizard <notifications@budgetwizard.fr>",
      to: [adminEmail],
      subject: "📢 Nouvel utilisateur inscrit sur BudgetWizard",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #3f51b5;">Nouvel utilisateur inscrit 🎉</h2>
          <p>Bonjour,</p>
          <p>Un nouvel utilisateur vient de s'inscrire sur BudgetWizard 🎉</p>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>👤 Nom :</strong> ${userName}</p>
            <p><strong>📧 Email :</strong> ${userEmail}</p>
            <p><strong>📅 Date d'inscription :</strong> ${signupDate}</p>
          </div>
          <p><a href="https://app.budgetwizard.fr/admin" style="background-color: #3f51b5; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px; display: inline-block;">🚀 Accéder au tableau de bord administrateur</a></p>
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
