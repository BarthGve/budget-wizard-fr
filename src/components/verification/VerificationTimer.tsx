
import { Clock3 } from "lucide-react";

interface VerificationTimerProps {
  remainingTime: number;
  formatTime: (seconds: number) => string;
}

/**
 * Affiche le temps restant avant expiration du lien
 */
export const VerificationTimer = ({ remainingTime, formatTime }: VerificationTimerProps) => {
  return (
    <div className="text-center space-y-2">
      <p className="text-sm text-muted-foreground">
        Le lien expirera dans
      </p>
      <div className="flex items-center justify-center gap-2">
        <Clock3 className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium">{formatTime(remainingTime)}</span>
      </div>
    </div>
  );
};
