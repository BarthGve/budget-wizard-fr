
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
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    // Vérifier que l'utilisateur arrive bien avec un token de réinitialisation
    const checkResetSession = async () => {
      setIsCheckingSession(true);
      console.log("Vérification de la session utilisateur pour la réinitialisation");
      
      try {
        // Extraire le hash fragment de l'URL
        const hash = location.hash; // ex: #access_token=...&type=recovery
        console.log("Hash de l'URL:", hash ? "présent" : "absent");

        // Essayer de récupérer directement la session actuelle
        const { data, error } = await supabase.auth.getSession();
        console.log("Session existante:", data.session ? "présente" : "absente");
        
        if (error) {
          console.error("Erreur lors de la vérification de la session:", error);
          throw error;
        }
        
        // Si nous n'avons pas de session valide, essayer de la récupérer à partir du hash
        if (!data.session && hash) {
          console.log("Tentative de récupération de la session à partir du hash");
          
          // Utiliser setSession pour établir la session
          await supabase.auth.getSession();
          
          // Vérifier à nouveau si nous avons une session valide
          const { data: refreshedSession, error: refreshError } = await supabase.auth.getSession();
          console.log("Session après récupération:", refreshedSession.session ? "présente" : "absente");
          
          if (refreshError || !refreshedSession.session) {
            console.error("Erreur lors de la récupération avec le hash:", refreshError);
            toast.error("Le lien de réinitialisation est invalide ou a expiré");
            navigate("/login");
            return;
          }
        }
        
        // Vérifier une dernière fois si nous avons une session valide
        const { data: finalCheck } = await supabase.auth.getSession();
        
        if (!finalCheck.session) {
          console.log("Pas de session valide trouvée");
          toast.error("Session invalide ou expirée");
          navigate("/login");
          return;
        }
        
        console.log("Session valide trouvée, l'utilisateur peut réinitialiser son mot de passe");
      } catch (error: any) {
        console.error("Erreur lors de la vérification de la session:", error);
        toast.error("Une erreur s'est produite lors de la vérification de votre session");
        navigate("/login");
      } finally {
        setIsCheckingSession(false);
      }
    };

    checkResetSession();
  }, [navigate, location]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    console.log("Tentative de mise à jour du mot de passe");

    // Validation des mots de passe
    if (password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères");
      setIsLoading(false);
      return;
    }

    try {
      // Appel à l'API Supabase pour mettre à jour le mot de passe
      const { data, error } = await supabase.auth.updateUser({
        password: password
      });

      console.log("Réponse de mise à jour du mot de passe:", { data, error });

      if (error) {
        console.error("Erreur détaillée:", error);
        throw error;
      }

      toast.success("Mot de passe mis à jour avec succès");
      console.log("Redirection vers la page de connexion");
      
      // Redirection vers la page de connexion après 2 secondes
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour du mot de passe:", error);
      toast.error(
        error.message || "Erreur lors de la mise à jour du mot de passe"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Afficher un message de chargement pendant la vérification de la session
  if (isCheckingSession) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center p-8">
          <p>Vérification de votre session...</p>
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
                minLength={6}
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
                minLength={6}
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
