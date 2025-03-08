
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, ArrowLeft, RefreshCw, Clock3 } from "lucide-react";
import { Link } from "react-router-dom";
import { VerificationInfo } from "./VerificationInfo";
import { VerificationTimer } from "./VerificationTimer";
import { VerificationHelp } from "./VerificationHelp";

interface VerificationCardProps {
  email: string;
  isEmailChange: boolean;
  isResending: boolean;
  remainingTime: number;
  formatTime: (seconds: number) => string;
  onResendEmail: () => Promise<void>;
}

/**
 * Carte principale de vérification d'email
 */
export const VerificationCard = ({
  email,
  isEmailChange,
  isResending,
  remainingTime,
  formatTime,
  onResendEmail
}: VerificationCardProps) => {
  return (
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
        <VerificationTimer remainingTime={remainingTime} formatTime={formatTime} />

        <div className="space-y-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={onResendEmail}
            disabled={isResending || remainingTime > 0}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isResending ? 'animate-spin' : ''}`} />
            {isResending ? "Envoi en cours..." : "Renvoyer l'email"}
          </Button>

          <VerificationHelp />
        </div>
      </CardContent>
    </Card>
  );
};
