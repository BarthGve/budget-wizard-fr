
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [validatingToken, setValidatingToken] = useState(true);

  useEffect(() => {
    // Récupérer le token depuis l'URL
    const params = new URLSearchParams(location.search);
    const urlToken = params.get('token');
    
    if (urlToken) {
      console.log("🔑 Token trouvé dans l'URL");
      setToken(urlToken);
      validateToken(urlToken);
    } else {
      // Vérifier si nous avons une session active ou un flux de réinitialisation en cours
      const checkSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          console.log("⚠️ Aucun token trouvé et pas de session active");
          toast.error("Session invalide ou expirée");
          navigate("/login");
        } else {
          console.log("✅ Session active trouvée");
          setValidatingToken(false);
        }
      };
      
      checkSession();
    }
  }, [location.search, navigate]);

  const validateToken = async (token: string) => {
    try {
      console.log("🔍 Validation du token de réinitialisation...");
      
      // Pour Supabase, on utilise le token dans l'URL pour créer une session
      // En appelant updateUser sans spécifier de password, on vérifie juste que le token est valide
      const { error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'recovery'
      });

      if (error) {
        console.error("❌ Token invalide:", error);
        toast.error("Lien de réinitialisation invalide ou expiré");
        navigate("/login");
        return;
      }

      console.log("✅ Token validé avec succès");
      setValidatingToken(false);
    } catch (error) {
      console.error("❌ Erreur lors de la validation du token:", error);
      toast.error("Erreur lors de la validation du lien de réinitialisation");
      navigate("/login");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      setIsLoading(false);
      return;
    }

    try {
      console.log("🔄 Mise à jour du mot de passe...");
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      console.log("✅ Mot de passe mis à jour avec succès");
      toast.success("Mot de passe mis à jour avec succès");
      
      // Rediriger vers la connexion après un court délai
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error: any) {
      console.error("❌ Erreur mise à jour mot de passe:", error);
      toast.error(
        error.message || "Erreur lors de la mise à jour du mot de passe"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (validatingToken) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center p-6">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p>Validation du lien de réinitialisation...</p>
          </div>
        </Card>
      </div>
    );
  }

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
          <CardTitle>Réinitialisation du mot de passe</CardTitle>
          <CardDescription>
            Entrez votre nouveau mot de passe
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="password">Nouveau mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmez le mot de passe</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Mise à jour..." : "Mettre à jour le mot de passe"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
