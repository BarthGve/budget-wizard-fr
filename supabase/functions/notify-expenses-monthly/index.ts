
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.1";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Interface pour les dépenses
interface Expense {
  id: string;
  amount: number;
  date: string;
  retailer_id: string;
  retailer_name: string;
  retailer_logo?: string;
}

// Interface pour les données résumées des dépenses par enseigne
interface RetailerSummary {
  retailer_id: string;
  retailer_name: string;
  retailer_logo?: string;
  total_amount: number;
  count: number;
}

serve(async (req) => {
  console.log("Fonction notify-expenses-monthly appelée:", new Date().toISOString());

  // Gérer les requêtes OPTIONS pour CORS
  if (req.method === "OPTIONS") {
    console.log("Requête OPTIONS reçue, retourne les en-têtes CORS");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Récupérer les variables d'environnement
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    // Validation des variables d'environnement
    if (!supabaseUrl || !supabaseServiceKey || !resendApiKey) {
      console.error("Variables d'environnement manquantes", { 
        supabaseUrl: !!supabaseUrl, 
        supabaseServiceKey: !!supabaseServiceKey, 
        resendApiKey: !!resendApiKey 
      });
      throw new Error("Variables d'environnement manquantes");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const resend = new Resend(resendApiKey);

    console.log("Vérification si la notification a déjà été envoyée ce mois-ci");
    
    // Obtenir le premier jour du mois actuel et le dernier jour du mois actuel
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    // Vérifier si une notification de dépenses a déjà été envoyée ce mois-ci
    const { data: notificationSentData, error: notificationCheckError } = await supabase.rpc(
      "check_notification_sent",
      {
        notification_type_param: "monthly_expenses",
        start_date: firstDayOfMonth.toISOString(),
        end_date: lastDayOfMonth.toISOString()
      }
    );

    if (notificationCheckError) {
      console.error("Erreur lors de la vérification des notifications précédentes:", notificationCheckError);
    } else if (notificationSentData) {
      console.log("Les notifications de dépenses ont déjà été envoyées ce mois-ci.");
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "Les notifications de dépenses ont déjà été envoyées ce mois-ci", 
          notificationSent: true 
        }),
        { 
          status: 200, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );
    }

    // Récupérer les utilisateurs avec notifications de dépenses activées
    console.log("Récupération des utilisateurs avec notifications de dépenses activées");
    const { data: users, error: usersError } = await supabase.rpc("get_users_with_expense_notifications_enabled");

    if (usersError) {
      console.error("Erreur lors de la récupération des utilisateurs:", usersError);
      throw usersError;
    }

    console.log(`${users?.length || 0} utilisateurs avec notifications de dépenses activées`);

    // Préparer les résultats
    const results: Record<string, any>[] = [];
    let successCount = 0;
    let errorCount = 0;

    // Calculer le premier jour du mois précédent et le dernier jour du mois précédent
    const previousMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastDayOfPreviousMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    
    // Format pour afficher le mois précédent
    const previousMonthName = previousMonth.toLocaleString('fr-FR', { month: 'long', year: 'numeric' });

    // Pour chaque utilisateur, récupérer les dépenses du mois précédent et envoyer l'email
    for (const user of users || []) {
      try {
        console.log(`Traitement des dépenses pour l'utilisateur ${user.profile_id}`);

        // Récupérer les dépenses du mois précédent pour cet utilisateur
        const { data: expenses, error: expensesError } = await supabase
          .from("expenses")
          .select(`
            id, 
            amount, 
            date,
            retailer_id,
            retailers (
              name,
              logo_url
            )
          `)
          .eq("profile_id", user.profile_id)
          .gte("date", previousMonth.toISOString().split('T')[0])
          .lte("date", lastDayOfPreviousMonth.toISOString().split('T')[0])
          .order("date", { ascending: false });

        if (expensesError) {
          console.error(`Erreur lors de la récupération des dépenses pour ${user.profile_id}:`, expensesError);
          throw expensesError;
        }

        // Si l'utilisateur n'a pas de dépenses, passer au suivant
        if (!expenses || expenses.length === 0) {
          console.log(`Aucune dépense pour l'utilisateur ${user.profile_id}, notification ignorée`);
          results.push({
            profile_id: user.profile_id,
            email: user.email,
            status: "skipped",
            reason: "Aucune dépense ce mois-ci"
          });
          continue;
        }

        console.log(`${expenses.length} dépenses trouvées pour l'utilisateur ${user.profile_id}`);

        // Transformer les données pour le format attendu
        const formattedExpenses: Expense[] = expenses.map(expense => ({
          id: expense.id,
          amount: expense.amount,
          date: expense.date,
          retailer_id: expense.retailer_id,
          retailer_name: expense.retailers?.name || "Enseigne inconnue",
          retailer_logo: expense.retailers?.logo_url
        }));

        // Calculer les résumés par enseigne
        const retailerSummaries: Record<string, RetailerSummary> = {};
        let totalAmount = 0;

        formattedExpenses.forEach(expense => {
          totalAmount += expense.amount;

          if (!retailerSummaries[expense.retailer_id]) {
            retailerSummaries[expense.retailer_id] = {
              retailer_id: expense.retailer_id,
              retailer_name: expense.retailer_name,
              retailer_logo: expense.retailer_logo,
              total_amount: 0,
              count: 0
            };
          }

          retailerSummaries[expense.retailer_id].total_amount += expense.amount;
          retailerSummaries[expense.retailer_id].count++;
        });

        // Convertir en tableau et trier par montant décroissant
        const sortedRetailerSummaries = Object.values(retailerSummaries)
          .sort((a, b) => b.total_amount - a.total_amount);

        // Récupérer le profil pour personnaliser l'email
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.profile_id)
          .single();

        if (profileError) {
          console.error(`Erreur lors de la récupération du profil ${user.profile_id}:`, profileError);
        }

        const userName = profile?.full_name || "Utilisateur";

        // Préparer le corps de l'email
        let retailerRows = '';

        sortedRetailerSummaries.forEach(retailer => {
          retailerRows += `
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e1e1e1;">
                <div style="display: flex; align-items: center;">
                  ${retailer.retailer_logo ? 
                    `<img src="${retailer.retailer_logo}" alt="${retailer.retailer_name}" style="width: 30px; height: 30px; margin-right: 10px; object-fit: contain;">` : 
                    `<div style="width: 30px; height: 30px; margin-right: 10px; background-color: #e1e1e1; border-radius: 50%;"></div>`
                  }
                  <span style="font-weight: 500;">${retailer.retailer_name}</span>
                </div>
              </td>
              <td style="padding: 10px; border-bottom: 1px solid #e1e1e1; text-align: right;">${retailer.count}</td>
              <td style="padding: 10px; border-bottom: 1px solid #e1e1e1; text-align: right; font-weight: 500;">${retailer.total_amount.toFixed(2).replace('.', ',')} €</td>
            </tr>
          `;
        });

        // Corps de l'email
        const emailHtml = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <meta charset="utf-8">
              <title>Récapitulatif de vos dépenses de ${previousMonthName}</title>
              <style>
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
                body {
                  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                  color: #1a1a1a;
                  line-height: 1.5;
                }
              </style>
            </head>
            <body style="margin: 0; padding: 0; background-color: #f7f7f7;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <tr>
                  <td align="center" style="padding: 10px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                      <h1 style="color: #333; font-size: 24px; font-weight: 600;">Récapitulatif de vos dépenses</h1>
                      <p style="color: #666; font-size: 16px;">${previousMonthName}</p>
                    </div>
                    
                    <div style="background-color: white; border-radius: 8px; padding: 25px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);">
                      <p style="margin-bottom: 20px; font-size: 16px;">Bonjour ${userName},</p>
                      
                      <p>Voici le récapitulatif de vos dépenses pour le mois de ${previousMonthName} :</p>
                      
                      <div style="background-color: #f5f7fa; border-radius: 8px; padding: 15px; margin: 20px 0;">
                        <p style="font-size: 18px; font-weight: 600; margin: 0; text-align: center;">
                          Total des dépenses: <span style="color: #1a73e8;">${totalAmount.toFixed(2).replace('.', ',')} €</span>
                        </p>
                      </div>
                      
                      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                        <thead>
                          <tr style="background-color: #f5f7fa;">
                            <th style="padding: 10px; text-align: left; border-bottom: 2px solid #e1e1e1;">Enseigne</th>
                            <th style="padding: 10px; text-align: right; border-bottom: 2px solid #e1e1e1;">Achats</th>
                            <th style="padding: 10px; text-align: right; border-bottom: 2px solid #e1e1e1;">Montant</th>
                          </tr>
                        </thead>
                        <tbody>
                          ${retailerRows}
                        </tbody>
                      </table>
                      
                      <div style="margin-top: 30px;">
                        <p>Vous pouvez consulter le détail de vos dépenses sur votre tableau de bord.</p>
                      </div>
                    </div>
                    
                    <div style="margin-top: 30px; padding: 15px; text-align: center; color: #666; font-size: 14px;">
                      <p>Vous recevez cet email car vous avez activé les notifications de dépenses mensuelles.</p>
                      <p>Pour désactiver ces notifications, accédez aux paramètres de votre compte.</p>
                    </div>
                  </td>
                </tr>
              </table>
            </body>
          </html>
        `;

        // Envoyer l'email
        console.log(`Envoi de l'email à ${user.email}`);
        const emailResponse = await resend.emails.send({
          from: "BudgetWizard <notifications@resend.dev>",
          to: [user.email],
          subject: `Récapitulatif de vos dépenses de ${previousMonthName}`,
          html: emailHtml,
        });

        console.log(`Email envoyé à ${user.email}:`, emailResponse);

        // Enregistrer le résultat
        results.push({
          profile_id: user.profile_id,
          email: user.email,
          status: "success",
          expenses_count: expenses.length,
          total_amount: totalAmount,
          retailers_count: sortedRetailerSummaries.length
        });

        successCount++;
      } catch (error: any) {
        console.error(`Erreur lors du traitement pour l'utilisateur ${user.profile_id}:`, error);
        
        // Enregistrer l'erreur
        results.push({
          profile_id: user.profile_id,
          email: user.email,
          status: "error",
          error: error.message || "Erreur inconnue"
        });
        
        errorCount++;
      }
    }

    // Enregistrer l'exécution dans les logs de notification
    const logData = {
      recipients: users?.map(u => u.email) || [],
      success_count: successCount,
      error_count: errorCount,
      results: results
    };

    const { error: logError } = await supabase
      .from("notification_logs")
      .insert({
        notification_type: "monthly_expenses",
        success: errorCount === 0,
        recipients_count: users?.length || 0,
        details: logData
      });

    if (logError) {
      console.error("Erreur lors de l'enregistrement du log de notification:", logError);
    }

    // Retourner les résultats
    return new Response(
      JSON.stringify({ 
        success: true,
        message: `Notifications de dépenses mensuelles envoyées avec succès: ${successCount} envoyées, ${errorCount} erreurs`,
        results: {
          total: users?.length || 0,
          success: successCount,
          error: errorCount,
          details: results
        }
      }),
      { 
        status: 200, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );
  } catch (error: any) {
    console.error("Erreur lors de l'envoi des notifications de dépenses:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: "Erreur lors de l'envoi des notifications de dépenses",
        error: error.message
      }),
      { 
        status: 500, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );
  }
});
