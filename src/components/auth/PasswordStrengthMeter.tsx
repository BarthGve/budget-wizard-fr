
import { Progress } from "@/components/ui/progress";
import { Shield, ShieldAlert, ShieldCheck } from "lucide-react";
import { validatePasswordStrength } from "@/utils/security";

interface PasswordStrengthMeterProps {
  password: string;
  showErrors?: boolean;
}

export const PasswordStrengthMeter = ({ password, showErrors = true }: PasswordStrengthMeterProps) => {
  const validation = validatePasswordStrength(password);
  
  if (!password) {
    return null;
  }

  const getStrengthColor = (score: number) => {
    if (score <= 2) return "bg-red-500";
    if (score <= 3) return "bg-yellow-500";
    if (score <= 4) return "bg-blue-500";
    return "bg-green-500";
  };

  const getStrengthText = (score: number) => {
    if (score <= 2) return "Faible";
    if (score <= 3) return "Moyen";
    if (score <= 4) return "Fort";
    return "Très fort";
  };

  const getStrengthIcon = (score: number) => {
    if (score <= 2) return <ShieldAlert className="h-4 w-4 text-red-500" />;
    if (score <= 4) return <Shield className="h-4 w-4 text-yellow-500" />;
    return <ShieldCheck className="h-4 w-4 text-green-500" />;
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        {getStrengthIcon(validation.score)}
        <span className="text-sm font-medium">
          Force du mot de passe: {getStrengthText(validation.score)}
        </span>
      </div>
      
      <Progress
        value={(validation.score / 5) * 100}
        className="h-2"
      />
      
      {showErrors && validation.errors.length > 0 && (
        <div className="space-y-1">
          {validation.errors.map((error, index) => (
            <p key={index} className="text-sm text-red-600">
              • {error}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};
