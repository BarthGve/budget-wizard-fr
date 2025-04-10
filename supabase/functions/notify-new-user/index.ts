
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

// Cache pour éviter l'envoi de notifications en double pour le même email
const notificationCache = new Map<string, number>();
const CACHE_EXPIRY = 60 * 1000; // 60 secondes

const handler = async (req: Request): Promise<Response> => {
  // Gérer les requêtes CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Notification d'inscription reçue");
    
    const { userName, userEmail, signupDate }: NewUserNotificationRequest = await req.json();
    
    console.log(`Détails d'inscription: Nom: ${userName}, Email: ${userEmail}, Date: ${signupDate}`);

    // Vérifier si une notification a déjà été envoyée récemment pour cet email
    const lastNotification = notificationCache.get(userEmail);
    const now = Date.now();
    
    if (lastNotification && now - lastNotification < CACHE_EXPIRY) {
      console.log(`Email déjà notifié récemment pour: ${userEmail} - ignoré`);
      return new Response(JSON.stringify({ success: true, status: "already_notified" }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    }
    
    // Enregistrer cette notification dans le cache
    notificationCache.set(userEmail, now);

    // Récupérer les IDs des administrateurs depuis la fonction RPC
    console.log("Appel de la fonction list_admins...");
    const { data: adminIds, error: rpcError } = await supabase.rpc('list_admins');
    
    if (rpcError) {
      console.error("Erreur lors de la récupération des IDs admin:", rpcError);
      throw rpcError;
    }

    if (!adminIds || adminIds.length === 0) {
      console.log("Aucun administrateur trouvé, aucun email ne sera envoyé");
      return new Response(JSON.stringify({ success: false, reason: "no_admins" }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    }
    
    // Extraire les IDs des administrateurs et les afficher dans les logs
    const adminIdList = adminIds.map(item => item.id);
    console.log("Liste des IDs admin:", adminIdList);

    // Récupérer les emails des administrateurs directement depuis auth.users
    const adminEmails = [];
    
    // Utilisation de listUsers au lieu de getUser pour chaque admin
    // Cette méthode est plus efficace et nous permet de filtrer correctement
    const { data: { users: allUsers }, error: usersError } = await supabase.auth.admin.listUsers({});
    
    if (usersError) {
      console.error("Erreur lors de la récupération des utilisateurs:", usersError);
      throw usersError;
    }
    
    console.log(`Nombre total d'utilisateurs trouvés: ${allUsers?.length || 0}`);
    
    // Créer un dictionnaire d'utilisateurs pour une recherche plus rapide
    const userMap = new Map();
    allUsers?.forEach(user => {
      userMap.set(user.id, user);
    });
    
    // Parcourir la liste des IDs d'admin et vérifier les préférences de notification
    for (const adminId of adminIdList) {
      // Récupérer d'abord le profil pour vérifier si les notifications sont activées
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('notif_inscriptions')
        .eq('id', adminId)
        .single();
        
      if (profileError) {
        console.warn(`Erreur lors de la récupération du profil pour l'admin ${adminId}:`, profileError);
        continue; // Passer à l'admin suivant
      }
      
      // Vérifier si les notifications sont activées pour cet admin
      if (profile.notif_inscriptions === false) {
        console.log(`Notifications désactivées pour l'admin ${adminId}, ignoré`);
        continue; // Passer à l'admin suivant
      }
      
      // Récupérer l'utilisateur depuis notre dictionnaire
      const adminUser = userMap.get(adminId);
      
      if (!adminUser) {
        console.warn(`Aucun utilisateur trouvé pour l'admin ${adminId}`);
        continue; // Passer à l'admin suivant
      }
      
      const adminEmail = adminUser.email;
      if (adminEmail) {
        console.log(`Email trouvé pour l'admin ${adminId}: ${adminEmail}`);
        adminEmails.push(adminEmail);
      }
    }
    
    console.log(`Emails d'admins à notifier (${adminEmails.length}):`, adminEmails);
    
    if (adminEmails.length === 0) {
      console.log("Aucun email d'administrateur valide trouvé ou notifications désactivées");
      return new Response(JSON.stringify({ success: false, reason: "no_valid_emails" }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    }
    
    // Envoyer l'email uniquement aux administrateurs
    const emailResponse = await resend.emails.send({
      from: "BudgetWizard <notifications@budgetwizard.fr>",
      to: adminEmails, // Uniquement les emails des administrateurs
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
    console.log("Destinataires:", adminEmails);

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
