
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
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload: WebhookPayload = await req.json();

    if (payload.type !== 'INSERT' || payload.table !== 'feedbacks') {
      return new Response(JSON.stringify({ message: 'Not a new feedback' }), { headers: corsHeaders, status: 200 });
    }

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing Supabase environment variables');
    }

    const supabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data: adminRoles, error: adminRolesError } = await supabaseClient.from('user_roles').select('user_id').eq('role', 'admin');
    if (adminRolesError || !adminRoles?.length) throw new Error('No admins found');

    const adminIds = adminRoles.map(role => role.user_id);
    const { data: adminUsers, error: adminUsersError } = await supabaseClient.auth.admin.listUsers();
    if (adminUsersError || !adminUsers?.users?.length) throw new Error('No admin users found');

    const adminEmails = adminUsers.users.filter(user => adminIds.includes(user.id) && typeof user.email === 'string').map(user => user.email as string);

    const { data: profile } = await supabaseClient.from('profiles').select('full_name').eq('id', payload.record.profile_id).single();
    const userName = profile?.full_name || 'Utilisateur';

    const emailPromises = adminEmails.map(adminEmail =>
      resend.emails.send({ from: 'Budget Wizard <notifications@vision2tech.fr>', to: adminEmail, subject: `Nouveau feedback : ${payload.record.title}`, html: `...` })
    );

    await Promise.allSettled(emailPromises);

    return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });

  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response(JSON.stringify({ error: error.message }), { headers: corsHeaders, status: 500 });
  }
});