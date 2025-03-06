
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

// Initialisation de Resend avec la clé API
const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

// Configuration des en-têtes CORS
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Initialisation du client Supabase
const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL") || "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
);

interface NotifyParams {
  id?: string; // ID de l'entrée changelog spécifique si manuellement déclenché
  manual?: boolean; // Si l'envoi est manuel ou automatique
}

const handler = async (req: Request): Promise<Response> => {
  // Gestion des requêtes OPTIONS pour CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    console.log("Démarrage de la fonction notify-changelog");
    
    let params: NotifyParams = {};
    if (req.method === "POST") {
      params = await req.json();
    }
    
    console.log("Paramètres reçus:", params);
    
    // Récupérer l'entrée du changelog (la plus récente ou celle spécifiée)
    let changelogEntry;
    if (params.id) {
      const { data, error } = await supabaseAdmin
        .from("changelog_entries")
        .select("*")
        .eq("id", params.id)
        .single();
        
      if (error) throw error;
      changelogEntry = data;
    } else {
      const { data, error } = await supabaseAdmin
        .from("changelog_entries")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();
        
      if (error) throw error;
      changelogEntry = data;
    }
    
    console.log("Entrée changelog trouvée:", changelogEntry);
    
    // Obtenir les IDs des administrateurs
    const { data: adminIds, error: adminError } = await supabaseAdmin.rpc("list_admins");
    if (adminError) throw adminError;
    
    console.log("IDs admin trouvés:", adminIds);
    
    // Récupérer tous les utilisateurs non-admin ayant activé les notifications changelog
    const { data: users, error: usersError } = await supabaseAdmin
      .from("profiles")
      .select("id, full_name, email")
      .eq("notif_changelog", true)
      .not("id", "in", `(${adminIds.map(admin => `'${admin.id}'`).join(",")})`);
      
    if (usersError) throw usersError;
    
    console.log(`${users?.length || 0} utilisateurs à notifier trouvés`);
    
    // Si aucun utilisateur à notifier, terminer
    if (!users || users.length === 0) {
      return new Response(
        JSON.stringify({ message: "Aucun utilisateur à notifier" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
    
    // Récupérer les emails des utilisateurs
    const emails = users.filter(user => user.email).map(user => user.email);
    
    if (emails.length === 0) {
      return new Response(
        JSON.stringify({ message: "Aucun email valide trouvé" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
    
    console.log(`Envoi d'emails à ${emails.length} utilisateurs`);
    
    // Construction du contenu HTML de l'email
    const emailHtml = `
      <p>Bonjour 👋,</p>
      
      <p>Nous avons ajouté de nouvelles fonctionnalités sur <strong>BudgetWizard</strong> ! 🎉</p>
      
      <h2>📢 ${changelogEntry.title}</h2>
      <p>${changelogEntry.description}</p>
      
      <p>🔎 <a href="https://budgetwizard.fr/changelog">Découvrez toutes les nouveautés ici</a></p>
      
      <p>À très bientôt sur BudgetWizard ! 🚀</p>
      <p>— L'équipe BudgetWizard</p>
    `;
    
    // Envoi des emails en batch
    const batchSize = 20; // Nombre d'emails par lot
    const batches = [];
    
    for (let i = 0; i < emails.length; i += batchSize) {
      batches.push(emails.slice(i, i + batchSize));
    }
    
    console.log(`Envoi en ${batches.length} lots`);
    
    const results = [];
    for (const batch of batches) {
      try {
        const result = await resend.emails.send({
          from: "BudgetWizard <notifications@budgetwizard.fr>",
          bcc: batch, // Utilisation de BCC pour préserver la confidentialité
          subject: "🚀 BudgetWizard évolue : découvrez les dernières nouveautés !",
          html: emailHtml,
        });
        
        results.push(result);
        console.log(`Lot d'emails envoyé avec succès:`, result);
      } catch (error) {
        console.error("Erreur lors de l'envoi du lot d'emails:", error);
        results.push({ error });
      }
    }
    
    return new Response(
      JSON.stringify({ 
        message: `Emails envoyés avec succès à ${emails.length} utilisateurs`,
        results 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
    
  } catch (error) {
    console.error("Erreur dans la fonction notify-changelog:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

// Démarrage du serveur
serve(handler);
