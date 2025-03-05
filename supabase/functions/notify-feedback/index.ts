
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WebhookPayload {
  type: 'INSERT' | 'UPDATE' | 'DELETE';
  table: string;
  record: {
    id: string;
    title: string;
    content: string;
    rating: number;
    profile_id: string;
    created_at: string;
  };
  schema: string;
  old_record: null | Record<string, any>;
}

serve(async (req: Request) => {
  console.log("Edge function notify-feedback called");

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log("Handling CORS preflight request");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload: WebhookPayload = await req.json();
    console.log("Received webhook payload:", payload);

    if (payload.type !== 'INSERT' || payload.table !== 'feedbacks') {
      console.log("Not a new feedback or wrong table:", payload.type, payload.table);
      return new Response(JSON.stringify({ message: 'Not a new feedback' }), { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 200 
      });
    }

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error("Missing Supabase environment variables");
      throw new Error('Missing Supabase environment variables');
    }

    console.log("Creating Supabase client with URL:", SUPABASE_URL);
    const supabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Get the profile information
    console.log("Fetching profile for ID:", payload.record.profile_id);
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('full_name, email')
      .eq('id', payload.record.profile_id)
      .single();

    if (profileError) {
      console.error("Error fetching profile:", profileError);
    }

    const userName = profile?.full_name || 'Utilisateur';
    const userEmail = profile?.email || 'Adresse email non disponible';
    console.log("User name resolved to:", userName);

    // Fetch admin roles
    console.log("Fetching admin roles...");
    const { data: adminRoles, error: adminRolesError } = await supabaseClient
      .from('user_roles')
      .select('user_id')
      .eq('role', 'admin');

    if (adminRolesError) {
      console.error("Error fetching admin roles:", adminRolesError);
      throw adminRolesError;
    }

    if (!adminRoles?.length) {
      console.log("No admin roles found");
      throw new Error('No admins found');
    }

    const adminIds = adminRoles.map(role => role.user_id);
    console.log("Admin IDs:", adminIds);

    // Get admin users' emails
    console.log("Fetching admin users...");
    const { data: adminUsers, error: adminUsersError } = await supabaseClient.auth.admin.listUsers();
    
    if (adminUsersError) {
      console.error("Error fetching admin users:", adminUsersError);
      throw adminUsersError;
    }

    if (!adminUsers?.users?.length) {
      console.log("No admin users found");
      throw new Error('No admin users found');
    }

    const adminEmails = adminUsers.users
      .filter(user => adminIds.includes(user.id) && typeof user.email === 'string')
      .map(user => user.email as string);

    // Ajouter l'email admin@budgetwizard à la liste des destinataires
    adminEmails.push('admin@budgetwizard');

    console.log("Admin emails (including admin@budgetwizard):", adminEmails);

    // Créer un lien vers la page de feedback dans l'application
    const feedbackUrl = `${SUPABASE_URL.replace('https://', 'https://budgetwizard.app/')}/admin/feedbacks?id=${payload.record.id}`;

    // Send emails to administrators
    console.log("Preparing to send emails...");
    const emailPromises = adminEmails.map(adminEmail =>
      resend.emails.send({
        from: 'Budget Wizard <notifications@budgetwizard.fr>',
        to: adminEmail,
        subject: `Nouveau feedback : ${payload.record.title}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333;">Nouveau feedback reçu</h1>
            <p style="color: #666;">Un nouveau feedback a été soumis par ${userName} (${userEmail}).</p>
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h2 style="color: #444; margin-top: 0;">${payload.record.title}</h2>
              <p style="color: #666;">${payload.record.content}</p>
              <p style="color: #888;">Note : ${payload.record.rating}/5</p>
            </div>
            <p style="color: #666;">Date de soumission : ${new Date(payload.record.created_at).toLocaleString('fr-FR')}</p>
            <div style="margin-top: 20px;">
              <a href="${feedbackUrl}" style="background-color: #4F46E5; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Voir le feedback dans l'application
              </a>
            </div>
          </div>
        `
      })
    );

    console.log("Sending emails...");
    const emailResults = await Promise.allSettled(emailPromises);
    
    // Log email sending results
    emailResults.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        console.log(`Email sent successfully to ${adminEmails[index]}`);
      } else {
        console.error(`Failed to send email to ${adminEmails[index]}:`, result.reason);
      }
    });

    return new Response(JSON.stringify({ success: true }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });

  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response(JSON.stringify({ error: error.message }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
      status: 500 
    });
  }
});
