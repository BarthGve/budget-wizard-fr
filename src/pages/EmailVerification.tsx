
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, ArrowLeft, RefreshCw, Clock3 } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const EmailVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState<string>("");
  const [isResending, setIsResending] = useState(false);
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [isEmailChange, setIsEmailChange] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    // Vérifier si c'est une vérification de changement d'email
    const params = new URLSearchParams(location.search);
    const type = params.get("type");
    const token = params.get("token");
    setIsEmailChange(type === "emailChange");
    
    // Get the email from localStorage (set during registration or email change)
    const storedEmail = localStorage.getItem("verificationEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    }

    // Si nous avons un token dans l'URL et que c'est un changement d'email,
    // essayons de vérifier immédiatement
    if (token && type === "emailChange") {
      verifyEmailChange(token);
    }

    // Récupérer l'heure de fin du compteur depuis localStorage ou en créer une nouvelle
    const getOrCreateEndTime = () => {
      const storedEndTime = localStorage.getItem("verificationEndTime");
      if (storedEndTime) {
        const endTime = parseInt(storedEndTime, 10);
        return endTime; // Retourner le temps stocké même s'il est déjà expiré
      }
      
      // Créer un nouveau temps uniquement s'il n'en existe pas déjà un
      const newEndTime = Date.now() + 120 * 1000;
      localStorage.setItem("verificationEndTime", newEndTime.toString());
      return newEndTime;
    };

    // Initialiser avec l'heure de fin stockée ou une nouvelle
    const endTime = getOrCreateEndTime();

    // Set up countdown timer
    const timer = setInterval(() => {
      const now = Date.now();
      const timeLeft = Math.max(0, Math.floor((endTime - now) / 1000));
      
      setRemainingTime(timeLeft);
      
      if (timeLeft <= 0) {
        clearInterval(timer);
      }
    }, 1000);

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      console.log("Event detected in EmailVerification:", event);
      if (event === "SIGNED_IN") {
        // Nettoyer tous les éléments liés à la vérification
        localStorage.removeItem("verificationEmail");
        localStorage.removeItem("verificationEndTime");
        
        // Définir un flag dans le localStorage pour indiquer que l'utilisateur vient juste de vérifier son email
        localStorage.setItem("justVerified", "true");
        
        // Rediriger vers la page de connexion au lieu de dashboard
        // Cela permettra de s'assurer que l'authentification est correctement initialisée
        navigate("/login");
      } else if (event === "USER_UPDATED") {
        // Si c'est une mise à jour de l'utilisateur (changement d'email)
        console.log("User updated after email verification");
        
        // Nettoyer les données de vérification
        localStorage.removeItem("verificationEmail");
        localStorage.removeItem("verificationEndTime");
        localStorage.removeItem("emailChangeToken");
        
        // Informer l'utilisateur et rediriger
        toast.success("Votre adresse email a été mise à jour avec succès");
        navigate("/user-settings");
      }
    });

    return () => {
      clearInterval(timer);
      subscription.unsubscribe();
    };
  }, [navigate, location.search]);

  const verifyEmailChange = async (token: string) => {
    setIsVerifying(true);
    try {
      // Vérifier que le token correspond à celui stocké dans le localStorage
      const storedToken = localStorage.getItem("emailChangeToken");
      
      if (token !== storedToken) {
        toast.error("Lien de vérification invalide");
        return;
      }
      
      // Obtenir l'utilisateur actuel
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user || !user.new_email) {
        toast.error("Aucun changement d'email en attente");
        return;
      }
      
      // Confirmer le changement d'email
      await supabase.auth.updateUser({
        email: user.new_email,
        email_confirm: true
      });
      
      // Nettoyer les données de vérification
      localStorage.removeItem("verificationEmail");
      localStorage.removeItem("verificationEndTime");
      localStorage.removeItem("emailChangeToken");
      
      // Informer l'utilisateur et rediriger
      toast.success("Votre adresse email a été mise à jour avec succès");
      navigate("/user-settings");
    } catch (error: any) {
      console.error("Erreur lors de la vérification du changement d'email:", error);
      toast.error("Erreur lors de la vérification du changement d'email");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendEmail = async () => {
    if (!email) {
      toast.error("Adresse email non trouvée");
      return;
    }

    setIsResending(true);
    try {
      if (isEmailChange) {
        // Récupérer l'utilisateur courant
        const { data: userData } = await supabase.auth.getUser();
        
        if (userData.user?.new_email) {
          const siteUrl = window.location.origin;
          const securityToken = `${new Date().getTime()}_${Math.random().toString(36).substring(2, 15)}`;
          localStorage.setItem("emailChangeToken", securityToken);
          
          const verificationLink = `${siteUrl}/email-verification?type=emailChange&token=${securityToken}`;
          
          // Envoyer un email personnalisé via notre fonction Edge
          const { error: emailError } = await supabase.functions.invoke('email-change-verification', {
            body: {
              oldEmail: userData.user.email || "votre adresse actuelle",
              newEmail: userData.user.new_email,
              verificationLink
            }
          });
          
          if (emailError) throw emailError;
        } else {
          throw new Error("Aucun changement d'email en attente");
        }
      } else {
        // Pour la vérification d'inscription
        const { error } = await supabase.auth.resend({
          type: 'signup',
          email: email,
        });

        if (error) throw error;
      }

      // Réinitialiser le compteur à 2 minutes
      const newEndTime = Date.now() + 120 * 1000;
      localStorage.setItem("verificationEndTime", newEndTime.toString());
      setRemainingTime(120);
      
      toast.success("Email de vérification envoyé");
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de l'envoi de l'email");
    } finally {
      setIsResending(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
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
          <div className="flex flex-col items-center text-center">
            <Mail className="h-12 w-12 text-primary mb-4" />
            <CardTitle>
              {isEmailChange ? "Vérifiez votre nouvelle adresse email" : "Vérifiez votre email"}
            </CardTitle>
            <CardDescription className="mt-2">
              Nous avons envoyé un email de vérification à{" "}
              <span className="font-medium">{email}</span>
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Le lien expirera dans
            </p>
            <div className="flex items-center justify-center gap-2">
              <Clock3 className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{formatTime(remainingTime)}</span>
            </div>
          </div>

          <div className="space-y-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleResendEmail}
              disabled={isResending || remainingTime > 0 || isVerifying}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isResending ? 'animate-spin' : ''}`} />
              {isResending ? "Envoi en cours..." : "Renvoyer l'email"}
            </Button>

            <div className="text-sm text-muted-foreground">
              <p className="text-center mb-2">Vous n'avez pas reçu l'email ?</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Vérifiez votre dossier spam</li>
                <li>Vérifiez que l'adresse email est correcte</li>
                <li>Patientez quelques minutes avant de réessayer</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailVerification;
