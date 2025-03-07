
import { ChangelogEntry, EmailBadge } from "../types.ts";
import { corsHeaders } from "../utils/cors.ts";
import { Resend } from "npm:resend@2.0.0";
import { marked } from "npm:marked@4.0.0";

/**
 * Crée le badge HTML en fonction du type de mise à jour
 */
export function getTypeBadge(type: string): EmailBadge {
  let badgeText, badgeColor;
  switch (type) {
    case "new":
      badgeText = "Nouvelle fonctionnalité";
      badgeColor = "#10b981"; // vert
      break;
    case "improvement":
      badgeText = "Amélioration";
      badgeColor = "#3b82f6"; // bleu
      break;
    case "bugfix":
      badgeText = "Correction de bug";
      badgeColor = "#f97316"; // orange
      break;
    default:
      badgeText = "Mise à jour";
      badgeColor = "#6b7280"; // gris
  }
  
  return { badgeText, badgeColor };
}

/**
 * Convertit le contenu Markdown en HTML
 */
export function markdownToHtml(markdown: string): string {
  try {
    // Option de conversion sécurisée
    return marked(markdown, { 
      sanitize: true,
      breaks: true  // respecte les sauts de ligne
    });
  } catch (error) {
    console.error("❌ Erreur lors de la conversion Markdown → HTML:", error);
    // En cas d'erreur, retourne le texte original avec des balises <p>
    return `<p>${markdown.replace(/\n/g, '</p><p>')}</p>`;
  }
}

/**
 * Crée le contenu HTML de l'email
 */
export function createEmailContent(entry: ChangelogEntry): string {
  const { badgeText, badgeColor } = getTypeBadge(entry.type);
  
  // Convertir la description Markdown en HTML
  const descriptionHtml = markdownToHtml(entry.description);
  
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
          .badge {
            display: inline-block;
            background-color: ${badgeColor};
            color: white;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 14px;
            margin-bottom: 10px;
          }
          h1 {
            color: #111;
            font-size: 24px;
            margin-bottom: 5px;
          }
          .version {
            color: #6b7280;
            font-size: 16px;
            margin-bottom: 20px;
          }
          .content {
            background-color: #f9fafb;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
          }
          .description {
            line-height: 1.6;
          }
          .description ul, .description ol {
            margin-top: 0.5em;
            margin-bottom: 0.5em;
            padding-left: 2em;
          }
          .description li {
            margin-bottom: 0.5em;
          }
          .description p {
            margin-top: 0.5em;
            margin-bottom: 0.5em;
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
          <p>Nous avons ajouté de nouvelles fonctionnalités sur <strong>BudgetWizard</strong> ! 🎉</p>
        </div>
        
        <div class="content">
          <div class="badge">${badgeText}</div>
          <h1>${entry.title}</h1>
          <div class="version">Version ${entry.version} - ${new Date(entry.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })}</div>
          <div class="description">${descriptionHtml}</div>
        </div>
        
        <p>
          <a href="https://budgetwizard.fr/changelog" class="cta-button">🔎 Découvrez toutes les nouveautés ici</a>
        </p>
        
        <div class="footer">
          <p>À très bientôt sur BudgetWizard ! 🚀</p>
          <p>— L'équipe BudgetWizard</p>
          <p style="font-size: 12px; margin-top: 20px;">Vous recevez cet email car vous êtes inscrit sur BudgetWizard. Pour ne plus recevoir ces notifications, vous pouvez les désactiver dans vos paramètres de profil.</p>
        </div>
      </body>
    </html>
  `;
}

/**
 * Envoie l'email de notification aux utilisateurs
 */
export async function sendNotificationEmail(resend: Resend, userEmails: string[], entry: ChangelogEntry) {
  try {
    console.log(`📝 Envoi d'emails à ${userEmails.length} destinataires (mode confidentiel)`);
    
    // Éviter d'afficher toutes les adresses dans les logs de production
    if (userEmails.length <= 5) {
      console.log(`📝 Destinataires: ${userEmails.join(', ')}`);
    } else {
      console.log(`📝 Premiers destinataires: ${userEmails.slice(0, 3).join(', ')}... et ${userEmails.length - 3} autres`);
    }
    
    const htmlContent = createEmailContent(entry);
    
    // Utiliser Bcc pour protéger la confidentialité des destinataires
    const emailResponse = await resend.emails.send({
      from: "BudgetWizard <notifications@budgetwizard.fr>",
      to: ["notifications@budgetwizard.fr"], // Adresse principale (visible)
      bcc: userEmails, // Tous les destinataires en copie cachée
      subject: `🚀 BudgetWizard évolue : découvrez les dernières nouveautés !`,
      html: htmlContent,
    });
    
    console.log("✅ Emails envoyés avec succès:", emailResponse);
    
    return {
      success: true,
      response: new Response(
        JSON.stringify({ 
          success: true, 
          message: `Notification envoyée à ${userEmails.length} utilisateurs de manière confidentielle`,
          emailResponse 
        }),
        { 
          status: 200, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      )
    };
  } catch (emailError) {
    console.error("❌ Erreur lors de l'envoi d'emails:", emailError);
    console.error("Détails de l'erreur:", emailError.stack);
    
    return {
      success: false,
      error: emailError,
      response: new Response(
        JSON.stringify({ 
          error: "Erreur lors de l'envoi des emails",
          details: emailError.message,
          stack: emailError.stack
        }),
        { 
          status: 500, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      )
    };
  }
}
