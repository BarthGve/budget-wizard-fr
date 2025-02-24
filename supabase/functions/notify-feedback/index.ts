
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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
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
      throw new Error('Missing Supabase environment variables');
    }

    const supabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Récupérer les administrateurs
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

    // Récupérer les emails des administrateurs
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

    console.log("Admin emails:", adminEmails);

    // Récupérer les informations du profil
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('full_name')
      .eq('id', payload.record.profile_id)
      .single();

    if (profileError) {
      console.error("Error fetching profile:", profileError);
    }

    const userName = profile?.full_name || 'Utilisateur';

    // Envoyer les emails aux administrateurs
    const emailPromises = adminEmails.map(adminEmail =>
      resend.emails.send({
        from: 'Budget Wizard <notifications@vision2tech.fr>',
        to: adminEmail,
        subject: `Nouveau feedback : ${payload.record.title}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333;">Nouveau feedback reçu</h1>
            <p style="color: #666;">Un nouveau feedback a été soumis par ${userName}.</p>
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h2 style="color: #444; margin-top: 0;">${payload.record.title}</h2>
              <p style="color: #666;">${payload.record.content}</p>
              <p style="color: #888;">Note : ${payload.record.rating}/5</p>
            </div>
            <p style="color: #666;">Date de soumission : ${new Date(payload.record.created_at).toLocaleString('fr-FR')}</p>
          </div>
        `
      })
    );

    console.log("Sending emails...");
    const emailResults = await Promise.allSettled(emailPromises);
    
    // Log des résultats d'envoi d'emails
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
