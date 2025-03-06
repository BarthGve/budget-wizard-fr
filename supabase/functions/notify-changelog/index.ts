
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

// Initialisation de Resend avec la clé API
const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
console.log("Initialisation de la fonction Edge notify-changelog");
console.log("RESEND_API_KEY configurée:", !!Deno.env.get("RESEND_API_KEY"));

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

console.log("Supabase client initialisé:", 
  !!Deno.env.get("SUPABASE_URL"), 
  !!Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
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
      console.log("Paramètres reçus:", JSON.stringify(params));
    } else {
      console.log("Requête reçue sans paramètres JSON");
    }
    
    // Récupérer l'entrée du changelog (la plus récente ou celle spécifiée)
    let changelogEntry;
    if (params.id) {
      console.log(`Recherche de l'entrée changelog avec ID: ${params.id}`);
      const { data, error } = await supabaseAdmin
        .from("changelog_entries")
        .select("*")
        .eq("id", params.id)
        .single();
        
      if (error) {
        console.error("Erreur lors de la récupération de l'entrée:", error);
        throw error;
      }
      changelogEntry = data;
      console.log("Entrée changelog trouvée par ID:", changelogEntry);
    } else {
      console.log("Recherche de la dernière entrée changelog");
      const { data, error } = await supabaseAdmin
        .from("changelog_entries")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();
        
      if (error) {
        console.error("Erreur lors de la récupération de la dernière entrée:", error);
        throw error;
      }
      changelogEntry = data;
      console.log("Dernière entrée changelog trouvée:", changelogEntry);
    }
    
    if (!changelogEntry) {
      console.error("Aucune entrée changelog trouvée");
      throw new Error("Aucune entrée changelog trouvée");
    }
    
    // Obtenir les IDs des administrateurs
    console.log("Récupération des IDs admin");
    const { data: adminIds, error: adminError } = await supabaseAdmin.rpc("list_admins");
    if (adminError) {
      console.error("Erreur lors de la récupération des IDs admin:", adminError);
      throw adminError;
    }
    
    console.log("IDs admin trouvés:", adminIds);
    
    // Récupérer tous les utilisateurs non-admin ayant activé les notifications changelog
    console.log("Récupération des utilisateurs à notifier");
    const adminIdsArray = adminIds.map(admin => admin.id);
    
    // Construction de la requête pour récupérer les profils
    let query = supabaseAdmin
      .from("profiles")
      .select("id, full_name, email:auth.users!id(email)")
      .eq("notif_changelog", true);
    
    // Exclure les administrateurs seulement s'il y en a
    if (adminIdsArray.length > 0) {
      console.log("Exclusion des administrateurs de la liste de notification");
      query = query.not("id", "in", `(${adminIdsArray.join(",")})`);
    }
    
    const { data: users, error: usersError } = await query;
      
    if (usersError) {
      console.error("Erreur lors de la récupération des utilisateurs:", usersError);
      throw usersError;
    }
    
    console.log(`${users?.length || 0} utilisateurs à notifier trouvés:`, users);
    
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
    const emails = users
      .filter(user => user.email && user.email[0]?.email)
      .map(user => user.email[0]?.email);
    
    console.log("Emails extraits:", emails);
    
    if (emails.length === 0) {
      console.log("Aucun email valide trouvé");
      return new Response(
        JSON.stringify({ message: "Aucun email valide trouvé" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
    
    console.log(`Envoi d'emails à ${emails.length} utilisateurs:`, emails);
    
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
    
    // Envoi des emails en lots (batches)
    const batchSize = 20; // Nombre d'emails par lot
    const batches = [];
    
    for (let i = 0; i < emails.length; i += batchSize) {
      batches.push(emails.slice(i, i + batchSize));
    }
    
    console.log(`Envoi en ${batches.length} lots`);
    
    const results = [];
    for (const batch of batches) {
      try {
        console.log(`Envoi d'un lot de ${batch.length} emails avec Resend`);
        console.log(`Email contenu: `, emailHtml.substring(0, 100) + "...");
        
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
        results.push({ error: String(error) });
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
    
  } catch (error: any) {
    console.error("Erreur dans la fonction notify-changelog:", error);
    return new Response(
      JSON.stringify({ error: error.message || String(error) }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

// Démarrage du serveur
console.log("Démarrage du serveur pour la fonction notify-changelog");
serve(handler);
