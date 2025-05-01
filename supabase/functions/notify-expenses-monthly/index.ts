
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.2";
import { Resend } from "npm:resend@2.0.0";

// Définition des types pour les dépenses
interface RetailerExpense {
  retailer_id: string;
  retailer_name: string;
  logo_url: string | null;
  current_month_total: number;
  previous_month_total: number;
  percentage_change: number;
}

interface UserExpenseData {
  profile_id: string;
  email: string;
  full_name: string | null;
  expenses: RetailerExpense[];
  total_current_month: number;
  total_previous_month: number;
  total_percentage_change: number;
  month_name: string;
  previous_month_name: string;
}

// Configuration CORS
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Gérer les requêtes OPTIONS pour CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Récupérer les paramètres Supabase et Resend depuis les variables d'environnement
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const resendApiKey = Deno.env.get("RESEND_API_KEY") || "";

    // Initialiser les clients Supabase et Resend
    const supabase = createClient(supabaseUrl, supabaseKey);
    const resend = new Resend(resendApiKey);

    console.log("Démarrage du traitement des notifications de dépenses mensuelles");

    // Récupérer la liste des utilisateurs ayant activé les notifications de dépenses
    const { data: users, error: usersError } = await supabase
      .rpc("get_users_with_expense_notifications_enabled");

    if (usersError) {
      throw new Error(`Erreur lors de la récupération des utilisateurs: ${usersError.message}`);
    }

    if (!users || users.length === 0) {
      console.log("Aucun utilisateur avec des notifications de dépenses activées");
      return new Response(JSON.stringify({ message: "Aucun utilisateur avec des notifications de dépenses activées" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Traitement des notifications pour ${users.length} utilisateurs`);

    // Obtenir le premier jour du mois en cours et du mois précédent
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const previousMonthDate = new Date(currentYear, currentMonth - 1, 1);
    const previousMonth = previousMonthDate.getMonth();
    const previousYear = previousMonthDate.getFullYear();
    
    const twoMonthsAgoDate = new Date(previousYear, previousMonth - 1, 1);
    const twoMonthsAgo = twoMonthsAgoDate.getMonth();
    const twoMonthsAgoYear = twoMonthsAgoDate.getFullYear();

    // Formater les noms des mois
    const previousMonthName = new Date(previousYear, previousMonth, 1).toLocaleDateString("fr-FR", { month: "long" });
    const twoMonthsAgoName = new Date(twoMonthsAgoYear, twoMonthsAgo, 1).toLocaleDateString("fr-FR", { month: "long" });
    
    // Formater les dates pour la requête SQL
    const startDatePreviousMonth = `${previousYear}-${(previousMonth + 1).toString().padStart(2, "0")}-01`;
    const endDatePreviousMonth = `${currentYear}-${(currentMonth + 1).toString().padStart(2, "0")}-01`;
    const startDateTwoMonthsAgo = `${twoMonthsAgoYear}-${(twoMonthsAgo + 1).toString().padStart(2, "0")}-01`;
    const endDateTwoMonthsAgo = `${previousYear}-${(previousMonth + 1).toString().padStart(2, "0")}-01`;

    // Traiter chaque utilisateur
    const emailPromises = users.map(async (user) => {
      try {
        // Récupérer les informations de profil
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.profile_id)
          .single();
        
        if (profileError) {
          console.error(`Erreur lors de la récupération du profil pour ${user.email}: ${profileError.message}`);
          return null;
        }

        // Récupérer les dépenses groupées par enseigne pour le mois précédent
        const { data: expensesPreviousMonth, error: expensesError1 } = await supabase
          .from("expenses")
          .select(`
            amount,
            retailers (id, name, logo_url)
          `)
          .eq("profile_id", user.profile_id)
          .gte("date", startDatePreviousMonth)
          .lt("date", endDatePreviousMonth);

        if (expensesError1) {
          console.error(`Erreur lors de la récupération des dépenses du mois précédent pour ${user.email}: ${expensesError1.message}`);
          return null;
        }

        // Récupérer les dépenses groupées par enseigne pour le mois d'avant
        const { data: expensesTwoMonthsAgo, error: expensesError2 } = await supabase
          .from("expenses")
          .select(`
            amount,
            retailers (id, name, logo_url)
          `)
          .eq("profile_id", user.profile_id)
          .gte("date", startDateTwoMonthsAgo)
          .lt("date", endDateTwoMonthsAgo);

        if (expensesError2) {
          console.error(`Erreur lors de la récupération des dépenses d'il y a deux mois pour ${user.email}: ${expensesError2.message}`);
          return null;
        }

        // Traiter et regrouper les données par enseigne
        const retailersMap = new Map<string, RetailerExpense>();
        let totalCurrentMonth = 0;
        let totalPreviousMonth = 0;

        // Traiter les dépenses du mois précédent
        expensesPreviousMonth?.forEach(expense => {
          if (!expense.retailers) return;

          const retailerId = expense.retailers.id;
          const retailerName = expense.retailers.name;
          const retailerLogo = expense.retailers.logo_url;
          const amount = expense.amount || 0;

          totalCurrentMonth += amount;

          if (retailersMap.has(retailerId)) {
            const currentData = retailersMap.get(retailerId)!;
            currentData.current_month_total += amount;
            retailersMap.set(retailerId, currentData);
          } else {
            retailersMap.set(retailerId, {
              retailer_id: retailerId,
              retailer_name: retailerName,
              logo_url: retailerLogo,
              current_month_total: amount,
              previous_month_total: 0,
              percentage_change: 0
            });
          }
        });

        // Traiter les dépenses d'il y a deux mois
        expensesTwoMonthsAgo?.forEach(expense => {
          if (!expense.retailers) return;

          const retailerId = expense.retailers.id;
          const retailerName = expense.retailers.name;
          const retailerLogo = expense.retailers.logo_url;
          const amount = expense.amount || 0;

          totalPreviousMonth += amount;

          if (retailersMap.has(retailerId)) {
            const currentData = retailersMap.get(retailerId)!;
            currentData.previous_month_total += amount;
            retailersMap.set(retailerId, currentData);
          } else {
            retailersMap.set(retailerId, {
              retailer_id: retailerId,
              retailer_name: retailerName,
              logo_url: retailerLogo,
              current_month_total: 0,
              previous_month_total: amount,
              percentage_change: -100
            });
          }
        });

        // Calculer les pourcentages de variation
        const retailerExpenses: RetailerExpense[] = [];
        retailersMap.forEach((data) => {
          if (data.previous_month_total > 0) {
            data.percentage_change = ((data.current_month_total - data.previous_month_total) / data.previous_month_total) * 100;
          } else if (data.current_month_total > 0) {
            data.percentage_change = 100; // Nouvelle dépense (augmentation de 100%)
          } else {
            data.percentage_change = 0; // Pas de dépense dans les deux mois
          }
          retailerExpenses.push(data);
        });

        // Trier les enseignes par montant dépensé (du plus élevé au plus faible)
        retailerExpenses.sort((a, b) => b.current_month_total - a.current_month_total);

        // Calculer la variation totale
        const totalPercentageChange = totalPreviousMonth > 0
          ? ((totalCurrentMonth - totalPreviousMonth) / totalPreviousMonth) * 100
          : totalCurrentMonth > 0 ? 100 : 0;

        const userData: UserExpenseData = {
          profile_id: user.profile_id,
          email: user.email,
          full_name: profile?.full_name || "utilisateur",
          expenses: retailerExpenses,
          total_current_month: totalCurrentMonth,
          total_previous_month: totalPreviousMonth,
          total_percentage_change: totalPercentageChange,
          month_name: previousMonthName,
          previous_month_name: twoMonthsAgoName
        };

        // Ne pas envoyer d'email si aucune dépense n'a été enregistrée
        if (retailerExpenses.length === 0) {
          console.log(`Aucune dépense pour ${user.email}, email non envoyé`);
          return null;
        }

        // Générer l'email HTML
        const emailHtml = generateExpensesEmailHtml(userData);
        
        // Envoyer l'email
        const emailResponse = await resend.emails.send({
          from: 'BudgetWizard <no-reply@resend.dev>',
          to: [user.email],
          subject: `Récapitulatif de vos dépenses - ${previousMonthName} ${previousYear}`,
          html: emailHtml
        });

        console.log(`Email envoyé à ${user.email}`, emailResponse);
        return emailResponse;
      } catch (error) {
        console.error(`Erreur lors du traitement de l'utilisateur ${user.email}:`, error);
        return null;
      }
    });

    await Promise.all(emailPromises);

    return new Response(JSON.stringify({ success: true, message: "Notifications de dépenses envoyées avec succès" }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Erreur lors de l'envoi des notifications de dépenses:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

// Fonction pour générer le contenu HTML de l'email
function generateExpensesEmailHtml(userData: UserExpenseData): string {
  // Formater les nombres pour l'affichage
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  // Générer les lignes pour chaque enseigne
  const retailerRows = userData.expenses.map(retailer => {
    const changeColor = retailer.percentage_change > 0 ? "#f87171" : "#4ade80";
    const changeIcon = retailer.percentage_change > 0 ? "↑" : "↓";
    const changeText = retailer.percentage_change !== 0 
      ? `${changeIcon} ${Math.abs(retailer.percentage_change).toFixed(1)}%`
      : "=";

    return `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">
        <div style="display: flex; align-items: center;">
          ${retailer.logo_url 
            ? `<img src="${retailer.logo_url}" alt="${retailer.retailer_name}" style="width: 30px; height: 30px; margin-right: 10px; border-radius: 4px;">`
            : `<div style="width: 30px; height: 30px; background-color: #e2e8f0; margin-right: 10px; border-radius: 4px; display: flex; align-items: center; justify-content: center;">${retailer.retailer_name.charAt(0)}</div>`
          }
          <span style="font-weight: 500;">${retailer.retailer_name}</span>
        </div>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: right;">${formatCurrency(retailer.current_month_total)}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: right;">${formatCurrency(retailer.previous_month_total)}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: right; color: ${changeColor};">${changeText}</td>
    </tr>
    `;
  }).join('');

  // Déterminer les couleurs pour la variation totale
  const totalChangeColor = userData.total_percentage_change > 0 ? "#f87171" : "#4ade80";
  const totalChangeIcon = userData.total_percentage_change > 0 ? "↑" : "↓";
  const totalChangeText = userData.total_percentage_change !== 0 
    ? `${totalChangeIcon} ${Math.abs(userData.total_percentage_change).toFixed(1)}%` 
    : "Aucun changement";

  // Générer le HTML complet de l'email
  return `
  <!DOCTYPE html>
  <html lang="fr">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Récapitulatif de vos dépenses</title>
  </head>
  <body style="font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.5; color: #1a202c; margin: 0; padding: 0; background-color: #f7fafc;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; margin-top: 20px; margin-bottom: 20px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
      <!-- Header -->
      <div style="background-color: #4f46e5; color: white; padding: 24px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px; font-weight: 600;">Récapitulatif de vos dépenses</h1>
        <p style="margin-top: 8px; margin-bottom: 0; font-size: 16px;">Mois de ${userData.month_name} ${new Date().getFullYear()}</p>
      </div>

      <!-- Content -->
      <div style="padding: 24px;">
        <p style="margin-top: 0; margin-bottom: 16px; font-size: 16px;">Bonjour ${userData.full_name},</p>
        <p style="margin-bottom: 24px; font-size: 16px;">Voici le récapitulatif de vos dépenses du mois de ${userData.month_name}, comparées à celles de ${userData.previous_month_name} :</p>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
          <thead>
            <tr style="background-color: #f1f5f9;">
              <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e2e8f0;">Enseigne</th>
              <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e2e8f0;">${userData.month_name}</th>
              <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e2e8f0;">${userData.previous_month_name}</th>
              <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e2e8f0;">Variation</th>
            </tr>
          </thead>
          <tbody>
            ${retailerRows}
            <tr style="background-color: #f8fafc; font-weight: 600;">
              <td style="padding: 16px; border-top: 2px solid #e2e8f0;">Total</td>
              <td style="padding: 16px; text-align: right; border-top: 2px solid #e2e8f0;">${formatCurrency(userData.total_current_month)}</td>
              <td style="padding: 16px; text-align: right; border-top: 2px solid #e2e8f0;">${formatCurrency(userData.total_previous_month)}</td>
              <td style="padding: 16px; text-align: right; border-top: 2px solid #e2e8f0; color: ${totalChangeColor};">${totalChangeText}</td>
            </tr>
          </tbody>
        </table>

        <p style="margin-bottom: 24px; font-size: 16px;">Pour consulter le détail de vos dépenses, cliquez sur le bouton ci-dessous :</p>

        <div style="text-align: center; margin-bottom: 24px;">
          <a href="https://votre-application.com/expenses" style="display: inline-block; background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; font-weight: 500; border-radius: 6px;">Voir mes dépenses</a>
        </div>
      </div>

      <!-- Footer -->
      <div style="background-color: #f1f5f9; padding: 16px; text-align: center; color: #64748b; font-size: 14px;">
        <p style="margin-top: 0; margin-bottom: 8px;">Ce message a été envoyé automatiquement, merci de ne pas y répondre.</p>
        <p style="margin-bottom: 0;">Vous pouvez désactiver ces notifications dans <a href="https://votre-application.com/settings" style="color: #4f46e5; text-decoration: none;">vos paramètres</a>.</p>
      </div>
    </div>
  </body>
  </html>
  `;
}
