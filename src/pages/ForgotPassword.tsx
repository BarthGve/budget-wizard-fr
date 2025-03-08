
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
      // Utilisation de l'URL absolue configurée dans Supabase
      // Cette URL doit correspondre exactement à celle configurée dans Supabase
      const redirectUrl = `${window.location.origin}/reset-password`;
      console.log("URL de redirection configurée:", redirectUrl);

      // Appel direct à l'API Supabase pour réinitialiser le mot de passe
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      console.log("Réponse de Supabase:", { data, error });

      if (error) {
        console.error("Erreur détaillée:", error);
        throw error;
      }

      // On vérifie si on doit utiliser notre propre fonction pour l'envoi de l'email
      const useCustomResetEmail = false; // Modifiez cette valeur pour basculer entre les méthodes

      if (useCustomResetEmail) {
        try {
          // Tenter d'appeler notre fonction Edge personnalisée pour envoyer un email
          const { error: customEmailError } = await supabase.functions.invoke('send-reset-password', {
            body: { email, token: "token-temporaire-pour-test" }
          });
          
          if (customEmailError) {
            console.warn("Erreur lors de l'envoi de l'email personnalisé, on utilise le mécanisme par défaut:", customEmailError);
          } else {
            console.log("Email personnalisé envoyé avec succès");
          }
        } catch (customError) {
          console.warn("Exception lors de l'appel à la fonction personnalisée:", customError);
        }
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
