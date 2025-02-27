
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, ArrowLeft, RefreshCw, Clock3 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const EmailVerification = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [isResending, setIsResending] = useState(false);
  const [remainingTime, setRemainingTime] = useState(120); // 2 minutes in seconds

  useEffect(() => {
    // Get the email from localStorage (set during registration)
    const storedEmail = localStorage.getItem("verificationEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    }

    // Set up countdown timer
    const timer = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        localStorage.removeItem("verificationEmail");
        navigate("/dashboard");
      }
    });

    return () => {
      clearInterval(timer);
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleResendEmail = async () => {
    if (!email) {
      toast.error("Adresse email non trouvée");
      return;
    }

    setIsResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) throw error;

      toast.success("Email de vérification envoyé");
      setRemainingTime(120); // Reset timer to 2 minutes
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
            <CardTitle>Vérifiez votre email</CardTitle>
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
              disabled={isResending || remainingTime > 0}
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
