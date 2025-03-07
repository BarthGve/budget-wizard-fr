
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("📧 Demande de réinitialisation pour:", email);

      // Étape 1: Obtenir un token de réinitialisation via l'API Supabase
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      console.log("✅ Demande de réinitialisation acceptée par Supabase");

      // Étape 2: Envoyer un email personnalisé avec le token via notre fonction edge
      try {
        // Récupérer le hash du token depuis la réponse de Supabase (s'il est disponible)
        // Sinon, on fait confiance à Supabase pour envoyer l'email standard
        const resetToken = data?.token || "";
        
        if (resetToken) {
          console.log("🔑 Token récupéré, envoi de l'email personnalisé");
          
          const { error: sendError } = await supabase.functions.invoke("send-reset-password", {
            body: { email, token: resetToken }
          });
          
          if (sendError) {
            console.error("❌ Erreur envoi email personnalisé:", sendError);
            // On continue car Supabase a déjà accepté la demande et devrait envoyer un email standard
          } else {
            console.log("✉️ Email personnalisé envoyé avec succès");
          }
        }
      } catch (emailError) {
        console.error("❌ Erreur lors de l'envoi de l'email personnalisé:", emailError);
        // On continue même si l'email personnalisé échoue
      }

      toast.success("Un email de réinitialisation vous a été envoyé");
      setEmail("");
    } catch (error: any) {
      console.error("❌ Erreur réinitialisation:", error);
      toast.error(
        error.message || "Erreur lors de l'envoi de l'email de réinitialisation"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <Link
            to="/login"
            className="text-muted-foreground hover:text-foreground transition-colors mb-4 inline-flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à la connexion
          </Link>
          <CardTitle>Mot de passe oublié</CardTitle>
          <CardDescription>
            Entrez votre email pour recevoir un lien de réinitialisation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="vous@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Envoi en cours..." : "Envoyer le lien"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;
