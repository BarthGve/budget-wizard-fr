
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.1";
import { Resend } from "npm:resend@2.0.0";

// Configuration des en-têtes CORS
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Interface pour les données des crédits
interface CreditData {
  id: string;
  nom_credit: string;
  montant_mensualite: number;
  date_derniere_mensualite: string;
}

// Interface pour les données utilisateur avec les crédits
interface UserData {
  email: string;
  profile_id: string;
  credits: CreditData[];
}

// Fonction principale
serve(async (req) => {
  // Gérer les requêtes OPTIONS pour CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Créer le client Supabase avec les variables d'environnement
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
    );

    // Initialiser Resend pour l'envoi d'emails
    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

    // Récupérer les utilisateurs ayant activé les notifications de crédits et ayant des crédits expirant ce mois-ci
    const { data: users, error: usersError } = await supabaseAdmin
      .rpc("get_users_with_credit_notifications_enabled");

    if (usersError) {
      console.error("Erreur lors de la récupération des utilisateurs:", usersError);
      throw usersError;
    }

    if (!users || users.length === 0) {
      console.log("Aucun utilisateur avec des crédits expirant ce mois-ci.");
      return new Response(
        JSON.stringify({ message: "Aucun utilisateur à notifier" }),
        { 
          status: 200, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );
    }

    console.log(`${users.length} utilisateurs à notifier pour les crédits expirant ce mois-ci.`);

    // Préparer les données pour chaque utilisateur
    const usersData: UserData[] = [];
    
    for (const user of users) {
      // Récupérer les crédits arrivant à échéance ce mois-ci pour cet utilisateur
      const { data: credits, error: creditsError } = await supabaseAdmin
        .from("credits")
        .select("id, nom_credit, montant_mensualite, date_derniere_mensualite")
        .eq("profile_id", user.profile_id)
        .eq("statut", "actif")
        .gte("date_derniere_mensualite", new Date().toISOString().split("T")[0])
        .lte(
          "date_derniere_mensualite", 
          new Date(
            new Date().getFullYear(),
            new Date().getMonth() + 1,
            0
          ).toISOString().split("T")[0]
        );

      if (creditsError) {
        console.error(`Erreur lors de la récupération des crédits pour ${user.email}:`, creditsError);
        continue;
      }

      if (credits && credits.length > 0) {
        usersData.push({
          email: user.email,
          profile_id: user.profile_id,
          credits: credits
        });
      }
    }

    // Envoyer les emails
    const emailResults = [];

    for (const userData of usersData) {
      try {
        const emailContent = createEmailContent(userData);
        
        const emailResponse = await resend.emails.send({
          from: "BudgetWizard <notifications@budgetwizard.fr>",
          to: [userData.email],
          subject: "📅 Vos crédits arrivant à échéance ce mois-ci",
          html: emailContent,
        });
        
        emailResults.push({
          email: userData.email,
          success: true,
          response: emailResponse
        });
        
        console.log(`Email envoyé avec succès à ${userData.email}`);
      } catch (emailError) {
        console.error(`Erreur lors de l'envoi de l'email à ${userData.email}:`, emailError);
        
        emailResults.push({
          email: userData.email,
          success: false,
          error: emailError.message
        });
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Notifications envoyées à ${emailResults.length} utilisateurs`,
        results: emailResults
      }),
      { 
        status: 200, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );
  } catch (error) {
    console.error("Erreur lors de l'exécution de la fonction:", error);
    
    return new Response(
      JSON.stringify({ 
        error: "Erreur lors de l'envoi des notifications",
        details: error.message
      }),
      { 
        status: 500, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );
  }
});

// Fonction pour créer le contenu HTML de l'email
function createEmailContent(userData: UserData): string {
  const currentMonth = new Date().toLocaleString('fr-FR', { month: 'long' });
  const creditsTable = userData.credits.map(credit => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${credit.nom_credit}</td>
      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${formatDate(credit.date_derniere_mensualite)}</td>
      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">${formatCurrency(credit.montant_mensualite)} €</td>
    </tr>
  `).join('');

  const totalAmount = userData.credits.reduce((sum, credit) => sum + credit.montant_mensualite, 0);

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
          h1 {
            color: #111;
            font-size: 24px;
            margin-bottom: 15px;
          }
          .month-badge {
            display: inline-block;
            background-color: #3b82f6;
            color: white;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 14px;
            margin-bottom: 20px;
          }
          .content {
            background-color: #f9fafb;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          th {
            background-color: #f3f4f6;
            padding: 10px 8px;
            text-align: left;
            font-weight: 600;
            border-bottom: 2px solid #e5e7eb;
          }
          .total-row {
            font-weight: bold;
            background-color: #f3f4f6;
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
          <p>Voici un récapitulatif des crédits qui arrivent à échéance ce mois-ci :</p>
        </div>
        
        <div class="content">
          <div class="month-badge">${currentMonth}</div>
          <h1>Crédits arrivant à échéance</h1>
          
          <table>
            <thead>
              <tr>
                <th>Crédit</th>
                <th>Date d'échéance</th>
                <th style="text-align: right;">Mensualité</th>
              </tr>
            </thead>
            <tbody>
              ${creditsTable}
              <tr class="total-row">
                <td colspan="2" style="padding: 10px 8px; border-bottom: 1px solid #e5e7eb;">Total</td>
                <td style="padding: 10px 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">${formatCurrency(totalAmount)} €</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <p>
          <a href="https://budgetwizard.fr/credits" class="cta-button">🔎 Voir tous mes crédits</a>
        </p>
        
        <div class="footer">
          <p>À très bientôt sur BudgetWizard ! 🚀</p>
          <p>— L'équipe BudgetWizard</p>
          <p style="font-size: 12px; margin-top: 20px;">Vous recevez cet email car vous êtes inscrit sur BudgetWizard et avez activé les notifications de crédits. Pour ne plus recevoir ces notifications, vous pouvez les désactiver dans vos paramètres de profil.</p>
        </div>
      </body>
    </html>
  `;
}

// Fonction pour formater une date
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
}

// Fonction pour formater un montant en euros
function formatCurrency(amount: number): string {
  return amount.toLocaleString('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}
