
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"
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
    
    if (payload.type !== 'INSERT' || payload.table !== 'feedbacks') {
      return new Response(JSON.stringify({ message: 'Not a new feedback' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    // Créer un client Supabase pour récupérer les admins
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Récupérer les emails des administrateurs
    const { data: adminRoles } = await supabaseClient
      .from('user_roles')
      .select('user_id')
      .eq('role', 'admin');

    if (!adminRoles || adminRoles.length === 0) {
      throw new Error('No admins found');
    }

    // Récupérer les profils des administrateurs
    const adminIds = adminRoles.map(role => role.user_id);
    const { data: adminUsers } = await supabaseClient
      .auth.admin.listUsers();

    if (!adminUsers.users || adminUsers.users.length === 0) {
      throw new Error('No admin users found');
    }

    const adminEmails = adminUsers.users
      .filter(user => adminIds.includes(user.id))
      .map(user => user.email)
      .filter((email): email is string => email !== null);

    // Envoyer l'email à tous les administrateurs
    const { id, title, content, rating } = payload.record;
    
    // Récupérer le nom de l'utilisateur qui a soumis le feedback
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('full_name')
      .eq('id', payload.record.profile_id)
      .single();

    const userName = profile?.full_name || 'Utilisateur';

    const emailPromises = adminEmails.map(adminEmail =>
      resend.emails.send({
        from: 'Budget Wizard <notifications@vision2tech.fr>',
        to: adminEmail,
        subject: `Nouveau feedback : ${title}`,
        html: `
          <h1>Nouveau feedback reçu</h1>
          <p><strong>De :</strong> ${userName}</p>
          <p><strong>Titre :</strong> ${title}</p>
          <p><strong>Contenu :</strong> ${content}</p>
          <p><strong>Note :</strong> ${rating}/5</p>
          <p><strong>Date :</strong> ${new Date(payload.record.created_at).toLocaleString('fr-FR')}</p>
          <p>Connectez-vous à l'application pour gérer ce feedback.</p>
        `
      })
    );

    await Promise.all(emailPromises);

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );

  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      },
    );
  }
});
