
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) {
        throw error;
      }

      toast.success(
        "Un email de réinitialisation du mot de passe vous a été envoyé"
      );
      setIsResettingPassword(false);
    } catch (error: any) {
      console.error("Reset password error:", error);
      toast.error(
        "Erreur lors de l'envoi de l'email de réinitialisation"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      toast.success("Connexion réussie");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(
        error.message === "Invalid login credentials"
          ? "Email ou mot de passe incorrect"
          : "Erreur lors de la connexion"
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
            to="/"
            className="text-muted-foreground hover:text-foreground transition-colors mb-4 inline-flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Link>
          <CardTitle>
            {isResettingPassword ? "Réinitialisation du mot de passe" : "Connexion"}
          </CardTitle>
          <CardDescription>
            {isResettingPassword
              ? "Entrez votre email pour réinitialiser votre mot de passe"
              : "Connectez-vous pour accéder à votre tableau de bord"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form 
            className="space-y-4" 
            onSubmit={isResettingPassword ? handleResetPassword : handleSubmit}
          >
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
            {!isResettingPassword && (
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading
                ? isResettingPassword
                  ? "Envoi en cours..."
                  : "Connexion en cours..."
                : isResettingPassword
                ? "Envoyer le lien"
                : "Se connecter"}
            </Button>
          </form>
          
          <div className="mt-4 flex flex-col space-y-2 text-center text-sm text-muted-foreground">
            <button
              onClick={() => setIsResettingPassword(!isResettingPassword)}
              className="text-primary hover:underline cursor-pointer"
            >
              {isResettingPassword ? "Retour à la connexion" : "Mot de passe oublié ?"}
            </button>
            {!isResettingPassword && (
              <div>
                Pas encore de compte ?{" "}
                <Link to="/register" className="text-primary hover:underline">
                  Inscrivez-vous
                </Link>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
