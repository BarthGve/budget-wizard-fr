import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuthContext } from "@/context/AuthProvider";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [sessionActive, setSessionActive] = useState(false);
  
  const { updatePassword } = useAuthContext();

  useEffect(() => {
    const checkResetSession = async () => {
      setIsCheckingSession(true);
      console.log("Vérification de la session utilisateur pour la réinitialisation");
      console.log("URL complète:", window.location.href);
      console.log("Search params:", location.search);
      console.log("Hash:", location.hash);
      
      try {
        const hasSupabaseHash = location.hash && 
          (location.hash.includes('#access_token=') || 
           location.hash.includes('#error=') || 
           location.hash.includes('#type=recovery'));
        
        console.log("Hash Supabase détecté:", hasSupabaseHash);
        
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        console.log("Session initiale:", sessionData?.session ? "Session présente" : "Pas de session active");
        
        if (sessionError) {
          console.error("Erreur lors de la vérification de la session:", sessionError);
          throw sessionError;
        }

        if (sessionData.session) {
          console.log("Session valide déjà présente, l'utilisateur peut réinitialiser son mot de passe");
          setSessionActive(true);
          setIsCheckingSession(false);
          return;
        }
        
        if (hasSupabaseHash) {
          console.log("Hash détecté, tentative d'établissement de session via setSession");
          
          await supabase.auth.getSession();
          
          const { data: refreshedSession, error: refreshError } = await supabase.auth.getSession();
          console.log("Session après tentative d'établissement:", refreshedSession?.session ? "Session établie" : "Échec d'établissement de session");
          
          if (refreshError) {
            console.error("Erreur lors de la récupération avec le hash:", refreshError);
            toast.error("Le lien de réinitialisation est invalide ou a expiré");
            navigate("/login");
            return;
          }
          
          if (refreshedSession.session) {
            console.log("Session valide établie via hash, l'utilisateur peut réinitialiser son mot de passe");
            setSessionActive(true);
            setIsCheckingSession(false);
            return;
          }
          
          console.log("Pas de session valide établie malgré la présence d'un hash");
          toast.error("Session invalide ou expirée");
          navigate("/login");
          return;
        } else {
          console.log("Aucun hash de réinitialisation trouvé dans l'URL");
          toast.error("Lien de réinitialisation invalide");
          navigate("/login");
          return;
        }
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
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData.session) {
        toast.error("Votre session a expiré. Veuillez recommencer le processus de réinitialisation.");
        navigate("/forgot-password");
        return;
      }
      
      const success = await updatePassword(password);
      
      if (success) {
        toast.success("Mot de passe mis à jour avec succès");
        
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour du mot de passe:", error);
      toast.error(error.message || "Erreur lors de la mise à jour du mot de passe");
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingSession) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center p-8">
          <p>Vérification de votre session...</p>
        </Card>
      </div>
    );
  }

  if (!sessionActive) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center p-8">
          <CardTitle className="mb-4">Session invalide</CardTitle>
          <CardDescription className="mb-4">
            Votre lien de réinitialisation est invalide ou a expiré.
          </CardDescription>
          <Button onClick={() => navigate("/forgot-password")}>
            Demander un nouveau lien
          </Button>
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
