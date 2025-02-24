
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ResetPasswordEmailRequest {
  email: string;
  token: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, token }: ResetPasswordEmailRequest = await req.json();

    // Construire l'URL de réinitialisation avec le token
    const resetUrl = new URL(req.headers.get("origin") || "");
    resetUrl.pathname = "/reset-password";
    resetUrl.searchParams.set("token", token);

    const emailResponse = await resend.emails.send({
      from: "Budget Wizard <no-reply@vision2tech.fr>",
      to: [email],
      subject: "Réinitialisation de votre mot de passe",
      html: `
        <h1>Réinitialisation de votre mot de passe</h1>
        <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
        <p>Cliquez sur le lien ci-dessous pour définir un nouveau mot de passe :</p>
        <p>
          <a href="${resetUrl.toString()}" style="display: inline-block; padding: 10px 20px; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 5px;">
            Réinitialiser mon mot de passe
          </a>
        </p>
        <p>Ce lien est valable pendant 1 heure.</p>
        <p>Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email en toute sécurité.</p>
        <p>Cordialement,<br>L'équipe Budget Partagé</p>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-reset-password function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
