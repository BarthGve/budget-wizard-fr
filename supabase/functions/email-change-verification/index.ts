
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailChangeVerificationRequest {
  oldEmail: string;
  newEmail: string;
  verificationLink: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { oldEmail, newEmail, verificationLink }: EmailChangeVerificationRequest = await req.json();

    const emailResponse = await resend.emails.send({
      from: "Budget Wizard <no-reply@budgetwizard.fr>",
      to: [newEmail],
      subject: "Vérification de votre nouvelle adresse email",
      html: `
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Vérification de votre nouvelle adresse email</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 20px auto;
                    background-color: #ffffff;
                    border-radius: 10px;
                    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                }
                .header {
                    background: linear-gradient(135deg, #3f51b5, #9c27b0, #e91e63); /* Indigo 500, Purple 500, Rose 500 */
                    color: white;
                    text-align: center;
                    padding: 20px;
                    font-size: 24px;
                    font-weight: bold;
                }
                .content {
                    padding: 20px;
                    text-align: center;
                    color: #333;
                }
                .button {
                    display: inline-block;
                    padding: 12px 24px;
                    margin-top: 20px;
                    font-size: 16px;
                    color: white;
                    background: #3f51b5; /* Indigo 500 */
                    text-decoration: none;
                    border-radius: 5px;
                    font-weight: bold;
                }
                .footer {
                    text-align: center;
                    font-size: 12px;
                    color: #777;
                    padding: 20px;
                }
            </style>
        </head>
        <body>
        
        <div class="container">
            <div class="header">Vérification de votre nouvelle adresse email</div>
            <div class="content">
                <p>Vous avez demandé de changer votre adresse email de <strong>${oldEmail}</strong> vers <strong>${newEmail}</strong>.</p>
                <p>Pour confirmer ce changement, veuillez cliquer sur le bouton ci-dessous :</p>
                <a href="${verificationLink}" class="button">Vérifier mon email</a>
                <p>Ce lien est valable pendant 1 heure.</p>
                <p>Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email en toute sécurité.</p>
                <p>Cordialement,<br><strong>L'équipe Budget Wizard</strong></p>
            </div>
            <div class="footer">
                &copy; ${new Date().getFullYear()} Budget Wizard. Tous droits réservés.  
            </div>
        </div>
        
        </body>
      `,
    });

    console.log("Email envoyé avec succès:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Erreur dans la fonction email-change-verification:", error);
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
