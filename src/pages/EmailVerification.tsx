
import { useEmailVerification } from "@/hooks/useEmailVerification";
import { VerificationCard } from "@/components/verification/VerificationCard";

/**
 * Page de vérification d'email
 * Gère la vérification des emails après inscription et la modification d'email
 */
const EmailVerification = () => {
  const {
    email,
    isResending,
    remainingTime,
    isEmailChange,
    handleResendEmail,
    formatTime
  } = useEmailVerification();

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background flex items-center justify-center p-4">
      <VerificationCard
        email={email}
        isEmailChange={isEmailChange}
        isResending={isResending}
        remainingTime={remainingTime}
        formatTime={formatTime}
        onResendEmail={handleResendEmail}
      />
    </div>
  );
};

export default EmailVerification;
