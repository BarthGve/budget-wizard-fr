
interface VerificationInfoProps {
  email: string;
}

/**
 * Affiche les informations concernant l'email de vérification
 */
export const VerificationInfo = ({ email }: VerificationInfoProps) => {
  return (
    <div className="text-center mb-4">
      <p className="text-sm text-muted-foreground">
        Consultez votre boîte de réception et cliquez sur le lien de vérification envoyé à :
      </p>
      <p className="font-medium mt-1">{email}</p>
    </div>
  );
};
