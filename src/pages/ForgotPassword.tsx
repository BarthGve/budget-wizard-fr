
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

  const validateEmail = (email: string) => {
    // Expression régulière simple pour valider le format de l'email
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validation de l'email avant l'envoi
    if (!validateEmail(email)) {
      toast.error("Veuillez entrer une adresse email valide");
      return;
    }
    
    setIsLoading(true);
    console.log("Tentative d'envoi d'email de réinitialisation à:", email);

    try {
      // Méthode 1: Utilisation de Supabase directement
      const origin = window.location.origin;
      const redirectUrl = `${origin}/reset-password`;
      console.log("URL de redirection configurée:", redirectUrl);

      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      if (error) {
        console.error("Erreur Supabase:", error);
        throw error;
      }

      console.log("Réponse de Supabase:", { data });
      
      // Méthode 2: Utilisation de notre fonction edge comme solution de secours
      try {
        const response = await fetch(`${origin}/functions/v1/send-reset-password`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.SUPABASE_ANON_KEY || ''}`
          },
          body: JSON.stringify({ email }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          console.warn("Fonction edge avertissement:", errorData);
          // Ne pas lancer d'erreur ici car nous avons déjà essayé avec Supabase
        } else {
          console.log("Email envoyé via la fonction edge avec succès");
        }
      } catch (edgeError) {
        console.warn("Erreur avec la fonction edge (ignorée):", edgeError);
        // Ne pas lancer d'erreur ici car nous avons déjà essayé avec Supabase
      }

      // Message de succès même si l'email n'existe pas (sécurité)
      toast.success("Un email de réinitialisation vous a été envoyé");
      setEmail("");
    } catch (error: any) {
      console.error("Erreur lors de l'envoi de l'email de réinitialisation:", error);
      
      // Message générique pour éviter la divulgation d'informations
      toast.error(
        "Une erreur s'est produite. Veuillez vérifier votre email et réessayer."
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
